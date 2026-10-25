// Pure, unit-testable logic for the admin-api Edge Function (no Deno imports).
// Every privileged operation: verified JWT -> role looked up server-side in user_roles -> action -> admin_audit row.
// The service-role client is created only inside the function runtime and never reaches the browser.

export interface Deps {
  env: { url?: string; anon?: string; serviceKey?: string; allowedOrigins?: string };
  makeUserClient: (authHeader: string) => any;
  makeAdminClient: () => any;
}

type Role = "admin" | "moderator";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const hits = new Map<string, number[]>();

function cors(req: Request, allowed?: string) {
  const origin = req.headers.get("origin") ?? "";
  const list = (allowed ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const h: Record<string, string> = {
    "Content-Type": "application/json",
    "Vary": "Origin",
    "Access-Control-Allow-Headers": "authorization, content-type, apikey, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
  if (origin && list.includes(origin)) h["Access-Control-Allow-Origin"] = origin;
  return h;
}

const json = (b: unknown, status: number, h: Record<string, string>) => new Response(JSON.stringify(b), { status, headers: h });
const clampInt = (v: unknown, d: number, min: number, max: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.trunc(n))) : d;
};
const escLike = (s: string) => s.replace(/[\\%_]/g, (c) => "\\" + c).slice(0, 60);
const ageOf = (dob?: string | null) => {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(+d)) return null;
  const n = new Date();
  let a = n.getFullYear() - d.getFullYear();
  if (n < new Date(n.getFullYear(), d.getMonth(), d.getDate())) a--;
  return a;
};

export function _resetRateLimit() { hits.clear(); }

export async function handleAdminApi(req: Request, deps: Deps): Promise<Response> {
  const h = cors(req, deps.env.allowedOrigins);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405, h);
  const { url, anon, serviceKey } = deps.env;
  if (!url || !anon || !serviceKey) return json({ error: "server_not_configured" }, 500, h);

  const authHeader = req.headers.get("authorization") ?? "";
  if (!/^Bearer\s+\S+/i.test(authHeader)) return json({ error: "unauthenticated" }, 401, h);

  let body: any;
  try { body = await req.json(); } catch { return json({ error: "invalid_json" }, 400, h); }
  if (!body || typeof body.action !== "string") return json({ error: "invalid_request" }, 400, h);

  const userClient = deps.makeUserClient(authHeader);
  const { data: u, error: uErr } = await userClient.auth.getUser(authHeader.replace(/^Bearer\s+/i, ""));
  const uid: string | undefined = u?.user?.id;
  if (uErr || !uid) return json({ error: "unauthenticated" }, 401, h);

  const sb = deps.makeAdminClient();
  const { data: roleRows, error: rErr } = await sb.from("user_roles").select("role").eq("user_id", uid);
  if (rErr) return json({ error: "server_error" }, 500, h);
  const roles = new Set<string>((roleRows ?? []).map((r: any) => r.role));
  const role: Role | null = roles.has("admin") ? "admin" : roles.has("moderator") ? "moderator" : null;
  if (!role) return json({ error: "forbidden" }, 403, h); // non-staff learn nothing about the action set

  const now = Date.now();
  const recent = (hits.get(uid) ?? []).filter((t) => now - t < 60_000);
  if (recent.length >= 60) return json({ error: "rate_limited" }, 429, h);
  recent.push(now);
  hits.set(uid, recent);

  const needAdmin = () => role !== "admin";
  const audit = (action: string, target: string, note: string) =>
    sb.from("admin_audit").insert({ admin_id: uid, action, target, note: note.slice(0, 500) });

  try {
    switch (body.action) {
      case "whoami":
        return json({ role, userId: uid, email: u.user.email ?? null }, 200, h);

      case "list_users": {
        const limit = clampInt(body.limit, 50, 1, 100), offset = clampInt(body.offset, 0, 0, 100000);
        let q = sb.from("profiles")
          .select("id,name,city,gender,dob,status,onboarded,is_demo,last_active,created_at", { count: "exact" })
          .order("created_at", { ascending: false }).range(offset, offset + limit - 1);
        if (typeof body.search === "string" && body.search.trim()) q = q.ilike("name", `%${escLike(body.search.trim())}%`);
        if (body.status === "active" || body.status === "suspended") q = q.eq("status", body.status);
        const { data, error, count } = await q;
        if (error) throw error;
        const ids = (data ?? []).map((p: any) => p.id);
        const [subs, reps] = ids.length ? await Promise.all([
          sb.from("user_subscriptions").select("user_id,tier,status,expires_at").in("user_id", ids),
          sb.from("reports").select("target").in("target", ids).eq("status", "open"),
        ]) : [{ data: [] }, { data: [] }];
        const subBy = new Map((subs.data ?? []).map((s: any) => [s.user_id, s]));
        const repN = new Map<string, number>();
        (reps.data ?? []).forEach((r: any) => repN.set(r.target, (repN.get(r.target) ?? 0) + 1));
        return json({
          total: count ?? 0,
          users: (data ?? []).map((p: any) => ({
            id: p.id, name: p.name, city: p.city, gender: p.gender, age: ageOf(p.dob), status: p.status,
            onboarded: p.onboarded, isDemo: p.is_demo, lastActive: p.last_active, createdAt: p.created_at,
            subscription: subBy.get(p.id) ? { tier: (subBy.get(p.id) as any).tier, status: (subBy.get(p.id) as any).status, expiresAt: (subBy.get(p.id) as any).expires_at } : null,
            openReports: repN.get(p.id) ?? 0,
          })),
        }, 200, h);
      }

      case "list_reports": {
        const limit = clampInt(body.limit, 50, 1, 100);
        let q = sb.from("reports").select("id,reporter,target,category,note,source,status,created_at").order("created_at", { ascending: false }).limit(limit);
        if (["open", "actioned", "dismissed"].includes(body.status)) q = q.eq("status", body.status);
        const { data, error } = await q;
        if (error) throw error;
        const ids = [...new Set((data ?? []).flatMap((r: any) => [r.reporter, r.target]))];
        const { data: names } = ids.length ? await sb.from("profiles").select("id,name").in("id", ids) : { data: [] };
        const nm = new Map((names ?? []).map((p: any) => [p.id, p.name]));
        return json({ reports: (data ?? []).map((r: any) => ({ ...r, reporterName: nm.get(r.reporter) ?? null, targetName: nm.get(r.target) ?? null })) }, 200, h);
      }

      case "set_user_status": {
        const { userId, status, reason } = body;
        if (typeof userId !== "string" || !UUID.test(userId)) return json({ error: "invalid_user" }, 400, h);
        if (status !== "active" && status !== "suspended") return json({ error: "invalid_status" }, 400, h);
        if (typeof reason !== "string" || reason.trim().length < 3 || reason.length > 400) return json({ error: "reason_required" }, 400, h);
        if (userId === uid) return json({ error: "cannot_target_self" }, 400, h);
        const { data: tr } = await sb.from("user_roles").select("role").eq("user_id", userId);
        if ((tr ?? []).some((r: any) => r.role === "admin" || r.role === "moderator")) return json({ error: "cannot_target_staff" }, 403, h);
        const { data: prof } = await sb.from("profiles").select("id,status").eq("id", userId).maybeSingle();
        if (!prof) return json({ error: "not_found" }, 404, h);
        const { error } = await sb.from("profiles").update({ status }).eq("id", userId);
        if (error) throw error;
        const { error: aErr } = await audit(`user_${status}`, userId, reason.trim());
        if (aErr) { await sb.from("profiles").update({ status: prof.status }).eq("id", userId); throw aErr; } // no unaudited action
        return json({ ok: true, status }, 200, h);
      }

      case "resolve_report": {
        const { reportId, resolution, note } = body;
        if (typeof reportId !== "string" || !UUID.test(reportId)) return json({ error: "invalid_report" }, 400, h);
        if (resolution !== "actioned" && resolution !== "dismissed") return json({ error: "invalid_resolution" }, 400, h);
        if (typeof note !== "string" || note.trim().length < 3 || note.length > 400) return json({ error: "note_required" }, 400, h);
        const { data: upd, error } = await sb.from("reports").update({ status: resolution }).eq("id", reportId).eq("status", "open").select("id");
        if (error) throw error;
        if (!upd?.length) return json({ error: "not_found_or_already_resolved" }, 409, h);
        const { error: aErr } = await audit(`report_${resolution}`, reportId, note.trim());
        if (aErr) { await sb.from("reports").update({ status: "open" }).eq("id", reportId); throw aErr; }
        return json({ ok: true }, 200, h);
      }

      case "stats": {
        const c = (t: string, f?: (q: any) => any) => { let q = sb.from(t).select("*", { count: "exact", head: true }); if (f) q = f(q); return q; };
        const [all, susp, open, matches, subs] = await Promise.all([
          c("profiles", (q) => q.eq("is_demo", false)),
          c("profiles", (q) => q.eq("is_demo", false).eq("status", "suspended")),
          c("reports", (q) => q.eq("status", "open")),
          c("matches"),
          sb.from("user_subscriptions").select("tier").eq("status", "active"),
        ]);
        const tiers: Record<string, number> = {};
        (subs.data ?? []).forEach((s: any) => { tiers[s.tier] = (tiers[s.tier] ?? 0) + 1; });
        return json({ profiles: all.count ?? 0, suspended: susp.count ?? 0, openReports: open.count ?? 0, matches: matches.count ?? 0, activeSubscriptionsByTier: tiers }, 200, h);
      }

      case "list_audit": {
        if (needAdmin()) return json({ error: "forbidden" }, 403, h);
        const { data, error } = await sb.from("admin_audit").select("id,admin_id,action,target,note,created_at").order("created_at", { ascending: false }).limit(clampInt(body.limit, 100, 1, 200));
        if (error) throw error;
        return json({ entries: data ?? [] }, 200, h);
      }

      case "list_staff": {
        if (needAdmin()) return json({ error: "forbidden" }, 403, h);
        const { data, error } = await sb.from("user_roles").select("user_id,role").in("role", ["admin", "moderator"]);
        if (error) throw error;
        const staff = await Promise.all((data ?? []).map(async (r: any) => {
          const { data: au } = await sb.auth.admin.getUserById(r.user_id);
          return { userId: r.user_id, role: r.role, email: au?.user?.email ?? null };
        }));
        return json({ staff }, 200, h);
      }

      case "list_subscriptions": {
        if (needAdmin()) return json({ error: "forbidden" }, 403, h);
        const { data, error } = await sb.from("subscription_orders").select("id,user_id,store,order_id,product_id,tier,amount_inr,starts_at,expires_at,created_at").order("created_at", { ascending: false }).limit(clampInt(body.limit, 100, 1, 200));
        if (error) throw error;
        return json({ orders: data ?? [] }, 200, h);
      }

      default:
        return json({ error: "unknown_action" }, 400, h);
    }
  } catch (e) {
    console.error("admin-api error", body.action, (e as any)?.message ?? "unknown"); // never log tokens or row data
    return json({ error: "server_error" }, 500, h);
  }
}
