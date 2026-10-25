import test from "node:test";
import assert from "node:assert/strict";
import { handleAdminApi, _resetRateLimit } from "../supabase/functions/admin-api/handler.ts";

const U = "11111111-1111-4111-8111-111111111111";
const T = "22222222-2222-4222-8222-222222222222";
const STAFF = "33333333-3333-4333-8333-333333333333";

function mk(opts: { uid?: string | null; roles?: Record<string, string[]>; auditFails?: boolean } = {}) {
  const roles = opts.roles ?? {};
  const log: any[] = [];
  const profiles: Record<string, any> = { [T]: { id: T, status: "active" }, [STAFF]: { id: STAFF, status: "active" } };
  const sb = {
    from(t: string) {
      const st: any = { t, f: {} as any };
      const api: any = {
        select() { return api; }, eq(k: string, v: any) { st.f[k] = v; return api; }, in() { return api; },
        order() { return api; }, limit() { return api; }, range() { return api; }, ilike() { return api; },
        update(v: any) { st.upd = v; return api; },
        insert(v: any) { if (opts.auditFails) return Promise.resolve({ error: new Error("x") }); log.push({ t, v }); return Promise.resolve({ error: null }); },
        maybeSingle() { return Promise.resolve({ data: profiles[st.f.id] ?? null, error: null }); },
        then(res: any) {
          if (t === "user_roles") return res({ data: (roles[st.f.user_id] ?? []).map((r) => ({ role: r })), error: null });
          if (st.upd) { log.push({ t, upd: st.upd, f: st.f }); return res({ data: t === "reports" ? [{ id: 1 }] : null, error: null }); }
          return res({ data: [], error: null, count: 0 });
        },
      };
      return api;
    },
  };
  const deps = {
    env: { url: "u", anon: "a", serviceKey: "s", allowedOrigins: "https://admin.example" },
    makeUserClient: () => ({ auth: { getUser: async () => (opts.uid === null ? { data: {}, error: new Error("bad") } : { data: { user: { id: opts.uid ?? U, email: "a@b" } }, error: null }) } }),
    makeAdminClient: () => sb,
  };
  return { deps, log };
}
const call = (deps: any, body: any, auth: string | null = "Bearer tok") =>
  handleAdminApi(new Request("http://x", { method: "POST", headers: { ...(auth ? { authorization: auth } : {}), origin: "https://admin.example" }, body: JSON.stringify(body) }), deps);

test.beforeEach(() => _resetRateLimit());

test("no auth header -> 401", async () => assert.equal((await call(mk().deps, { action: "whoami" }, null)).status, 401));
test("invalid token -> 401", async () => assert.equal((await call(mk({ uid: null }).deps, { action: "whoami" })).status, 401));
test("authenticated non-staff -> 403 for every action", async () => {
  const { deps } = mk({ roles: { [U]: ["user"] } });
  for (const a of ["whoami", "list_users", "set_user_status", "stats", "list_audit"]) assert.equal((await call(deps, { action: a })).status, 403);
});
test("moderator can whoami but not list_audit/list_staff/list_subscriptions", async () => {
  const { deps } = mk({ roles: { [U]: ["moderator"] } });
  assert.equal((await (await call(deps, { action: "whoami" })).json()).role, "moderator");
  for (const a of ["list_audit", "list_staff", "list_subscriptions"]) assert.equal((await call(deps, { action: a })).status, 403);
});
test("admin can list_audit", async () => assert.equal((await call(mk({ roles: { [U]: ["admin"] } }).deps, { action: "list_audit" })).status, 200));
test("client-supplied role is ignored", async () => assert.equal((await call(mk({ roles: { [U]: ["user"] } }).deps, { action: "list_audit", role: "admin" })).status, 403));
test("suspend requires reason, valid uuid and status", async () => {
  const { deps } = mk({ roles: { [U]: ["moderator"] } });
  assert.equal((await call(deps, { action: "set_user_status", userId: T, status: "suspended", reason: "" })).status, 400);
  assert.equal((await call(deps, { action: "set_user_status", userId: "nope", status: "suspended", reason: "abuse" })).status, 400);
  assert.equal((await call(deps, { action: "set_user_status", userId: T, status: "banned", reason: "abuse" })).status, 400);
});
test("cannot target self or staff", async () => {
  const { deps } = mk({ roles: { [U]: ["admin"], [STAFF]: ["moderator"] } });
  assert.equal((await call(deps, { action: "set_user_status", userId: U, status: "suspended", reason: "abuse" })).status, 400);
  assert.equal((await call(deps, { action: "set_user_status", userId: STAFF, status: "suspended", reason: "abuse" })).status, 403);
});
test("suspend writes an audit row", async () => {
  const { deps, log } = mk({ roles: { [U]: ["moderator"] } });
  assert.equal((await call(deps, { action: "set_user_status", userId: T, status: "suspended", reason: "harassment" })).status, 200);
  const a = log.find((l) => l.t === "admin_audit");
  assert.equal(a.v.admin_id, U); assert.equal(a.v.action, "user_suspended"); assert.equal(a.v.target, T);
});
test("failed audit reverts the change and errors", async () => {
  const { deps, log } = mk({ roles: { [U]: ["moderator"] }, auditFails: true });
  assert.equal((await call(deps, { action: "set_user_status", userId: T, status: "suspended", reason: "harassment" })).status, 500);
  assert.deepEqual(log.filter((l) => l.upd).map((l) => l.upd.status), ["suspended", "active"]);
});
test("resolve_report validates and audits", async () => {
  const { deps, log } = mk({ roles: { [U]: ["moderator"] } });
  assert.equal((await call(deps, { action: "resolve_report", reportId: T, resolution: "deleted", note: "ok ok" })).status, 400);
  assert.equal((await call(deps, { action: "resolve_report", reportId: T, resolution: "dismissed", note: "no violation" })).status, 200);
  assert.equal(log.find((l) => l.t === "admin_audit").v.action, "report_dismissed");
});
test("unknown action 400, GET 405, rate limit 429", async () => {
  const { deps } = mk({ roles: { [U]: ["admin"] } });
  assert.equal((await call(deps, { action: "drop_tables" })).status, 400);
  assert.equal((await handleAdminApi(new Request("http://x"), deps)).status, 405);
  let last = 0; for (let i = 0; i < 62; i++) last = (await call(deps, { action: "whoami" })).status;
  assert.equal(last, 429);
});
test("CORS only echoes allowlisted origin", async () => {
  const { deps } = mk({ roles: { [U]: ["admin"] } });
  const r = await handleAdminApi(new Request("http://x", { method: "OPTIONS", headers: { origin: "https://evil.example" } }), deps);
  assert.equal(r.headers.get("access-control-allow-origin"), null);
});
