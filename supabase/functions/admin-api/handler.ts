// Pure, unit-testable logic for the admin-api Edge Function (no Deno imports).
// Every privileged operation: verified JWT -> role looked up server-side in user_roles -> action -> admin_audit row.
// The service-role client is created only inside the function runtime and never reaches the browser.

export interface Deps {
  env: { url?: string; anon?: string; serviceKey?: string; allowedOrigins?: string };
  makeUserClient: (authHeader: string) => any;
  makeAdminClient: () => any;
  /** Injected for tests; defaults to the global fetch (used only for Expo push delivery). */
  fetchImpl?: typeof fetch;
}

const EXPO_PUSH_ENDPOINT = "https://exp.host/--/api/v2/push/send";
const AD_IMAGE_MAX_BYTES = 1_048_576;
const SEGMENT_KEYS = ["gender", "city", "plan"] as const;

/** JPEG / PNG / WEBP by magic bytes; anything else is refused. */
export function detectImageType(bytes: Uint8Array): string | null {
  if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.length > 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (bytes.length > 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") return "image/webp";
  return null;
}

/** Normalises an ad from the admin form; returns an error code instead of throwing. */
export function validateAd(a: any): { ok: true; row: Record<string, unknown> } | { ok: false; error: string } {
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const row: Record<string, unknown> = {
    advertiser: str(a?.advertiser, 60),
    title: str(a?.title, 60),
    body: str(a?.body, 300),
    cta_label: str(a?.ctaLabel, 24) || "Learn more",
    cta_url: str(a?.ctaUrl, 500) || null,
    target_gender: a?.targetGender === "man" || a?.targetGender === "woman" ? a.targetGender : "",
    target_cities: Array.isArray(a?.targetCities)
      ? a.targetCities.map((c: unknown) => str(c, 80)).filter(Boolean).slice(0, 50)
      : [],
    weight: clampInt(a?.weight, 1, 1, 100),
    starts_at: a?.startsAt ? new Date(a.startsAt).toISOString() : new Date().toISOString(),
    ends_at: a?.endsAt ? new Date(a.endsAt).toISOString() : null,
  };
  if (!row.advertiser || !row.title) return { ok: false, error: "ad_fields_required" };
  if (row.cta_url && !/^https:\/\/[^\s]+$/i.test(String(row.cta_url))) return { ok: false, error: "ad_url_must_be_https" };
  if (row.ends_at && Date.parse(String(row.ends_at)) <= Date.parse(String(row.starts_at))) return { ok: false, error: "ad_dates_invalid" };
  // Only paths produced by upload_ad_image are accepted (no "..", no other folders).
  if (typeof a?.imagePath === "string" && /^creatives\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(a.imagePath)) row.image_path = a.imagePath;
  return { ok: true, row };
}

export function cleanSegment(seg: any): Record<string, string> {
  const out: Record<string, string> = {};
  if (seg?.gender === "man" || seg?.gender === "woman") out.gender = seg.gender;
  if (typeof seg?.city === "string" && seg.city.trim()) out.city = seg.city.trim().slice(0, 80);
  if (seg?.plan === "free" || seg?.plan === "paid") out.plan = seg.plan;
  return out;
}

/** CSV with every cell quoted; cells starting with = + - @ are prefixed so spreadsheets never run them as formulas. */
export function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0]);
  const cell = (v: unknown) => {
    let t = v === null || v === undefined ? "" : String(v);
    if (/^[=+\-@\t\r]/.test(t)) t = "'" + t;
    return '"' + t.replace(/"/g, '""') + '"';
  };
  return [cols.map(cell).join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\n");
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
        const dayAgo = new Date(Date.now() - 86400_000).toISOString();
        // Counted in the database (head/count or aggregate RPC): never limited by the 1,000-row page size.
        const [all, susp, open, matches, tiers, newToday, activeToday] = await Promise.all([
          c("profiles", (q) => q.eq("is_demo", false)),
          c("profiles", (q) => q.eq("is_demo", false).eq("status", "suspended")),
          c("reports", (q) => q.eq("status", "open")),
          c("matches"),
          sb.rpc("admin_tier_counts"),
          c("profiles", (q) => q.eq("is_demo", false).gte("created_at", dayAgo)),
          c("profiles", (q) => q.eq("is_demo", false).gte("last_active", dayAgo)),
        ]);
        return json({ profiles: all.count ?? 0, suspended: susp.count ?? 0, openReports: open.count ?? 0, matches: matches.count ?? 0,
          newLast24h: newToday.count ?? 0, activeLast24h: activeToday.count ?? 0,
          activeSubscriptionsByTier: (tiers.data && typeof tiers.data === "object") ? tiers.data : {} }, 200, h);
      }

      case "list_audit": {
        if (needAdmin()) return json({ error: "forbidden" }, 403, h);
        const { data, error } = await sb.from("admin_audit").select("id,admin_id,action,target,note,created_at").order("created_at", { ascending: false }).limit(clampInt(body.limit, 100, 1, 200));
        if (error) throw error;
        // Show who did it by email (staff only, a handful of lookups).
        const actors = [...new Set((data ?? []).map((e: any) => e.admin_id).filter((x: any) => typeof x === "string" && UUID.test(x)))].slice(0, 50);
        const emails = new Map<string, string | null>();
        await Promise.all(actors.map(async (id: any) => {
          const { data: au } = await sb.auth.admin.getUserById(id);
          emails.set(id, au?.user?.email ?? null);
        }));
        return json({ entries: (data ?? []).map((e: any) => ({ ...e, actorEmail: emails.get(e.admin_id) ?? null })) }, 200, h);
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

      // Admins can add or remove MODERATORS by email. Granting or removing the admin role is still only possible in
      // the database, so a stolen admin session can never create more admins or lock the owner out.
      case "set_moderator": {
        if (needAdmin()) return json({ error: "forbidden" }, 403, h);
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        const grant = body.grant === true;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return json({ error: "invalid_email" }, 400, h);
        let target: any = null;
        for (let page = 1; page <= 20 && !target; page++) {
          const { data: lst, error } = await sb.auth.admin.listUsers({ page, perPage: 1000 });
          if (error) throw error;
          target = (lst?.users ?? []).find((x: any) => (x.email ?? "").toLowerCase() === email) ?? null;
          if ((lst?.users ?? []).length < 1000) break;
        }
        if (!target) return json({ error: "no_account_for_email" }, 404, h);
        if (target.id === uid) return json({ error: "cannot_target_self" }, 400, h);
        const { data: tr } = await sb.from("user_roles").select("role").eq("user_id", target.id);
        if ((tr ?? []).some((r: any) => r.role === "admin")) return json({ error: "cannot_target_staff" }, 403, h);
        if (grant) {
          if (!(tr ?? []).some((r: any) => r.role === "moderator")) {
            const { error } = await sb.from("user_roles").insert({ user_id: target.id, role: "moderator" });
            if (error) throw error;
          }
        } else {
          const { error } = await sb.from("user_roles").delete().eq("user_id", target.id).eq("role", "moderator");
          if (error) throw error;
        }
        await audit(grant ? "moderator_added" : "moderator_removed", target.id, email);
        return json({ ok: true }, 200, h);
      }

      case "list_subscriptions": {
        if (needAdmin()) return json({ error: "forbidden" }, 403, h);
        const { data, error } = await sb.from("subscription_orders").select("id,user_id,store,order_id,product_id,tier,amount_inr,starts_at,expires_at,created_at,provider_state,auto_renew").order("created_at", { ascending: false }).limit(clampInt(body.limit, 100, 1, 200));
        if (error) throw error;
        return json({ orders: data ?? [] }, 200, h);
      }

      // ---------------- Users: view, verify ----------------
      case "get_user": {
        const { userId } = body;
        if (typeof userId !== "string" || !UUID.test(userId)) return json({ error: "invalid_user" }, 400, h);
        const { data: p, error } = await sb.from("profiles")
          .select("id,name,city,gender,seeking,dob,bio,work,education,interests,intents,languages,photos,status,onboarded,is_demo,last_active,created_at")
          .eq("id", userId).maybeSingle();
        if (error) throw error;
        if (!p) return json({ error: "not_found" }, 404, h);
        const paths: string[] = Array.isArray(p.photos) ? p.photos.map((x: any) => x?.path).filter((x: any) => typeof x === "string") : [];
        const [signed, sub, against, filed, state, matches] = await Promise.all([
          paths.length ? sb.storage.from("photos").createSignedUrls(paths, 300) : Promise.resolve({ data: [] }),
          sb.from("user_subscriptions").select("tier,status,starts_at,expires_at").eq("user_id", userId).maybeSingle(),
          sb.from("reports").select("id,category,note,source,status,created_at").eq("target", userId).order("created_at", { ascending: false }).limit(20),
          sb.from("reports").select("id", { count: "exact", head: true }).eq("reporter", userId),
          sb.from("account_state").select("data").eq("user_id", userId).maybeSingle(),
          sb.from("matches").select("id", { count: "exact", head: true }).or(`user_a.eq.${userId},user_b.eq.${userId}`),
        ]);
        await audit("user_viewed", userId, "Profile opened in admin panel");
        return json({
          user: {
            id: p.id, name: p.name, city: p.city, gender: p.gender, seeking: p.seeking, age: ageOf(p.dob), bio: p.bio,
            work: p.work, education: p.education, interests: p.interests, intents: p.intents, languages: p.languages,
            status: p.status, onboarded: p.onboarded, isDemo: p.is_demo, lastActive: p.last_active, createdAt: p.created_at,
            photos: (signed.data ?? []).map((r: any) => r.signedUrl).filter(Boolean),
            subscription: sub.data ?? null,
            verification: (state.data?.data?.verification?.status as string) ?? "none",
            matchCount: matches.count ?? 0,
            reportsFiled: filed.count ?? 0,
            reportsAgainst: against.data ?? [],
          },
        }, 200, h);
      }

      case "review_verification": {
        const { userId, decision, note } = body;
        if (typeof userId !== "string" || !UUID.test(userId)) return json({ error: "invalid_user" }, 400, h);
        if (decision !== "approved" && decision !== "rejected" && decision !== "none") return json({ error: "invalid_status" }, 400, h);
        const { error } = await sb.rpc("review_verification", { _user_id: userId, _status: decision, _reviewer: uid, _note: typeof note === "string" ? note.slice(0, 300) : "" });
        if (error) return json({ error: /pending/i.test(error.message) ? "verification_not_pending" : "server_error" }, error && /pending/i.test(error.message) ? 409 : 500, h);
        await audit(`verification_${decision}`, userId, typeof note === "string" && note.trim() ? note.trim() : decision);
        return json({ ok: true }, 200, h);
      }

      case "export_users": {
        if (needAdmin()) return json({ error: "forbidden" }, 403, h);
        // Paged: Supabase returns at most 1,000 rows per request.
        const data: any[] = [];
        for (let from = 0; from < 50000; from += 1000) {
          const { data: page, error } = await sb.from("profiles").select("id,name,city,gender,dob,status,onboarded,is_demo,last_active,created_at")
            .eq("is_demo", false).order("created_at", { ascending: false }).range(from, from + 999);
          if (error) throw error;
          data.push(...(page ?? []));
          if ((page ?? []).length < 1000) break;
        }
        await audit("users_exported", "profiles", `${(data ?? []).length} rows`);
        return json({ csv: toCsv((data ?? []).map((p: any) => ({ id: p.id, name: p.name, city: p.city, gender: p.gender, age: ageOf(p.dob), status: p.status, onboarded: p.onboarded, last_active: p.last_active, joined: p.created_at }))) }, 200, h);
      }

      // ---------------- Ads (sponsored cards in Discover) ----------------
      case "list_ads": {
        if (needAdmin()) return json({ error: "forbidden" }, 403, h);
        const { data, error } = await sb.from("ads").select("*").order("created_at", { ascending: false }).limit(200);
        if (error) throw error;
        const { data: agg, error: sErr } = await sb.rpc("admin_ad_stats");
        if (sErr) throw sErr;
        const stats = new Map<string, { impressions: number; clicks: number }>(
          (agg ?? []).map((r: any) => [r.ad_id, { impressions: Number(r.impressions ?? 0), clicks: Number(r.clicks ?? 0) }]),
        );
        const pub = (path: string | null) => (path ? sb.storage.from("ads").getPublicUrl(path).data?.publicUrl ?? null : null);
        return json({ ads: (data ?? []).map((a: any) => ({ ...a, imageUrl: pub(a.image_path), ...(stats.get(a.id) ?? { impressions: 0, clicks: 0 }) })) }, 200, h);
      }

      case "upload_ad_image": {
        if (needAdmin()) return json({ error: "forbidden" }, 403, h);
        if (typeof body.base64 !== "string" || body.base64.length > Math.ceil(AD_IMAGE_MAX_BYTES * 4 / 3) + 16) return json({ error: "image_too_large" }, 413, h);
        let bytes: Uint8Array;
        try { bytes = Uint8Array.from(atob(body.base64), (c) => c.charCodeAt(0)); } catch { return json({ error: "invalid_image" }, 400, h); }
        const type = detectImageType(bytes);
        if (!type) return json({ error: "invalid_image" }, 400, h);
        if (bytes.length > AD_IMAGE_MAX_BYTES) return json({ error: "image_too_large" }, 413, h);
        const path = `creatives/${crypto.randomUUID()}.${type.split("/")[1].replace("jpeg", "jpg")}`;
        const { error } = await sb.storage.from("ads").upload(path, bytes, { contentType: type, upsert: false });
        if (error) throw error;
        await audit("ad_image_uploaded", path, `${bytes.length} bytes`);
        return json({ path, url: sb.storage.from("ads").getPublicUrl(path).data?.publicUrl ?? null }, 200, h);
      }

      case "save_ad": {
        if (needAdmin()) return json({ error: "forbidden" }, 403, h);
        const v = validateAd(body.ad);
        if (!v.ok) return json({ error: v.error }, 400, h);
        const id = body.ad?.id;
        if (id !== undefined && (typeof id !== "string" || !UUID.test(id))) return json({ error: "invalid_ad" }, 400, h);
        const row = { ...v.row, updated_at: new Date().toISOString() };
        const res = id
          ? await sb.from("ads").update(row).eq("id", id).select("id").maybeSingle()
          : await sb.from("ads").insert({ ...row, created_by: uid, active: false }).select("id").maybeSingle();
        if (res.error) throw res.error;
        if (!res.data) return json({ error: "not_found" }, 404, h);
        await audit(id ? "ad_updated" : "ad_created", res.data.id, String(v.row.title));
        return json({ ok: true, id: res.data.id }, 200, h);
      }

      case "set_ad_active": {
        if (needAdmin()) return json({ error: "forbidden" }, 403, h);
        if (typeof body.adId !== "string" || !UUID.test(body.adId) || typeof body.active !== "boolean") return json({ error: "invalid_ad" }, 400, h);
        const { data, error } = await sb.from("ads").update({ active: body.active, updated_at: new Date().toISOString() }).eq("id", body.adId).select("id");
        if (error) throw error;
        if (!data?.length) return json({ error: "not_found" }, 404, h);
        await audit(body.active ? "ad_started" : "ad_paused", body.adId, "");
        return json({ ok: true }, 200, h);
      }

      case "delete_ad": {
        if (needAdmin()) return json({ error: "forbidden" }, 403, h);
        if (typeof body.adId !== "string" || !UUID.test(body.adId)) return json({ error: "invalid_ad" }, 400, h);
        const { data: ad } = await sb.from("ads").select("image_path").eq("id", body.adId).maybeSingle();
        const { error } = await sb.from("ads").delete().eq("id", body.adId);
        if (error) throw error;
        if (ad?.image_path) await sb.storage.from("ads").remove([ad.image_path]);
        await audit("ad_deleted", body.adId, "");
        return json({ ok: true }, 200, h);
      }

      // ---------------- Broadcast notifications ----------------
      case "list_announcements": {
        if (needAdmin()) return json({ error: "forbidden" }, 403, h);
        const { data, error } = await sb.from("announcements").select("*").order("created_at", { ascending: false }).limit(100);
        if (error) throw error;
        return json({ announcements: data ?? [] }, 200, h);
      }

      case "send_announcement": {
        if (needAdmin()) return json({ error: "forbidden" }, 403, h);
        const title = typeof body.title === "string" ? body.title.trim() : "";
        const text = typeof body.body === "string" ? body.body.trim() : "";
        if (title.length < 1 || title.length > 60 || text.length < 1 || text.length > 200) return json({ error: "announcement_text_invalid" }, 400, h);
        const segment = cleanSegment(body.segment);
        const dryRun = body.dryRun === true;
        const { data: ann, error: aErr } = dryRun ? { data: null, error: null } :
          await sb.from("announcements").insert({ title, body: text, segment, created_by: uid }).select("id").maybeSingle();
        if (aErr) throw aErr;
        const doFetch = deps.fetchImpl ?? fetch;
        let after: string | null = null, recipients = 0, sent = 0, failed = 0;
        for (let page = 0; page < 200; page++) {
          const { data: targets, error } = await sb.rpc("announcement_targets", { _segment: segment, _after: after, _limit: 500 });
          if (error) throw error;
          const rows = (targets ?? []) as { device_id: string; push_token: string }[];
          if (!rows.length) break;
          after = rows[rows.length - 1].device_id;
          recipients += rows.length;
          if (!dryRun) {
            for (let i = 0; i < rows.length; i += 100) {
              const batch = rows.slice(i, i + 100);
              try {
                const r = await doFetch(EXPO_PUSH_ENDPOINT, {
                  method: "POST",
                  headers: { "Content-Type": "application/json", Accept: "application/json" },
                  body: JSON.stringify(batch.map((t) => ({
                    to: t.push_token, title, body: text, sound: "default", channelId: "default", priority: "normal", ttl: 86400,
                    data: { category: "announcement", announcementId: ann?.id },
                  }))),
                });
                const out = r.ok ? await r.json().catch(() => ({})) : {};
                const tickets: any[] = Array.isArray(out?.data) ? out.data : [];
                const ok = tickets.filter((t) => t?.status === "ok").length;
                sent += ok; failed += batch.length - ok;
              } catch { failed += batch.length; }
            }
          }
          if (rows.length < 500) break;
        }
        if (dryRun) return json({ recipients }, 200, h);
        await sb.from("announcements").update({ recipients, sent, failed, finished_at: new Date().toISOString() }).eq("id", ann!.id);
        await audit("announcement_sent", ann!.id, `${title} -> ${JSON.stringify(segment)} (${sent}/${recipients})`);
        return json({ ok: true, recipients, sent, failed }, 200, h);
      }

      // ---------------- Payments ----------------
      case "list_purchase_attempts": {
        if (needAdmin()) return json({ error: "forbidden" }, 403, h);
        let q = sb.from("purchase_attempts").select("id,user_id,store,product_id,outcome,http_status,reason,created_at").order("created_at", { ascending: false }).limit(clampInt(body.limit, 100, 1, 200));
        if (["verified", "pending", "failed", "retryable"].includes(body.outcome)) q = q.eq("outcome", body.outcome);
        const { data, error } = await q;
        if (error) throw error;
        return json({ attempts: data ?? [] }, 200, h);
      }

      case "payments_summary": {
        if (needAdmin()) return json({ error: "forbidden" }, 403, h);
        const { data, error } = await sb.rpc("admin_payments_summary", { _days: 30 });
        if (error) throw error;
        const d = (data ?? {}) as any;
        return json({ last30Days: { orders: Number(d.orders ?? 0), revenueInr: Number(d.revenueInr ?? 0), failedAttempts: Number(d.failedAttempts ?? 0), refundsOrRevocations: Number(d.refundsOrRevocations ?? 0) } }, 200, h);
      }

      // ---------------- Business reports ----------------
      case "business_report": {
        if (needAdmin()) return json({ error: "forbidden" }, 403, h);
        const day = /^\d{4}-\d{2}-\d{2}$/;
        if (typeof body.from !== "string" || typeof body.to !== "string" || !day.test(body.from) || !day.test(body.to) || body.from > body.to) return json({ error: "invalid_dates" }, 400, h);
        const { data, error } = await sb.rpc("admin_daily_metrics", { _from: body.from, _to: body.to });
        if (error) throw error;
        await audit("business_report", `${body.from}..${body.to}`, "");
        return json({ rows: data ?? [], csv: toCsv(data ?? []) }, 200, h);
      }

      default:
        return json({ error: "unknown_action" }, 400, h);
    }
  } catch (e) {
    console.error("admin-api error", body.action, (e as any)?.message ?? "unknown"); // never log tokens or row data
    return json({ error: "server_error" }, 500, h);
  }
}
