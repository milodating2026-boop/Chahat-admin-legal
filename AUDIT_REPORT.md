# Chahat website — audit, fixes and deployment guide

**Sources audited:** the attached app repo (Chahat/Milo, Expo + Supabase) and this website ZIP. The GitHub URL named in the brief (`Milo-Prototype-Baseline`) was **not** accessed; the attached app ZIP was used as the backend source of truth. The app was not modified.

## 1. Findings (before changes)

| # | Sev | Finding | Evidence |
|---|-----|---------|----------|
| 1 | Critical | Admin "authorization" was client-side: allowlist hardcoded + stored in browser localStorage; role always `owner` after any Supabase login | old `services/store.ts` (`ADMIN_ACCOUNTS`, `loadLocalRealState`, `role:'owner'`) |
| 2 | Critical | Login bypass: wrong password still logged the two owner emails in; a "Log in with Permitted Owner Account" button needed no password; layout auto-authenticated if not signed in | old `admin-login/page.tsx`, `admin/layout.tsx` |
| 3 | Critical | Site could not build: `services/supabase` imported but missing | `tsc` / import grep |
| 4 | High | Website schema conflicted with the real backend (`admin_users`, `abuse_reports`, `admin_audit_logs`, `subscription_ledger`, `account_deletion_requests`, and `CREATE TABLE IF NOT EXISTS public.profiles`). Real backend uses `user_roles`, `reports`, `admin_audit`, `user_subscriptions`, `subscription_orders` | old migrations vs app `supabase/migrations` |
| 5 | High | Moderation could never work for real: app RLS lets only the service role change `profiles.status`; the old code used the anon key, failed silently (`try/catch` ignored) and still updated local UI + local "audit log" | `profiles_guard`, old `updateUserStatus` |
| 6 | High | Delete-account page was fake: stored a ticket in localStorage, nothing was deleted, no ownership check (anyone could "request" deletion for any email) | old `requestAccountDeletion` |
| 7 | High | Notifications, crashes, analytics, settings, verification review and subscriptions pages used local/fake data and claimed "delivered" | old store + pages |
| 8 | Medium | Privacy/FAQ claims not supported by the code: calls "end-to-end encrypted", AES-256/TLS 1.3/MFA, DPDP "compliance"; policy omitted location, chats, selfies, push tokens, Agora, Google Vision, retained records | old privacy page vs app docs |
| 9 | Medium | Support form showed "ticket submitted" without sending anything; unverified `support@/safety@chahat.app` addresses | old support page |
| 10 | Low | `/contact` missing; no security headers; admin pages indexable; unused Gemini dependency | — |
| — | OK | No service-role/secret keys found in the website source or bundle. Only the *publishable* key appeared in `.env.example` (public by design). The built JS contains the string `sb_secret_` only inside supabase-js's own key-prefix check. | grep of source and `.next/static` |

## 2. What was implemented (website only)

- **`supabase/functions/admin-api`** (new Edge Function): verifies the caller JWT, looks up the role in the app's existing `user_roles` (`admin` / `moderator`) with the service key server-side, ignores any client-supplied role, rate-limits (60/min/user), validates input, restricts CORS to `ADMIN_ALLOWED_ORIGINS`, and writes an `admin_audit` row for every write (the change is reverted if the audit insert fails). Actions: `whoami`, `list_users`, `list_reports`, `set_user_status` (suspend/restore), `resolve_report`, `stats`; admin-only: `list_audit`, `list_staff`, `list_subscriptions`. It refuses to act on yourself or on staff. User email/phone/chats/photos are not exposed; purchase-token hashes are not returned.
- **No new migration needed.** Old conflicting migrations were moved to `supabase/deprecated/` (**do not apply**).
- **Admin console rebuilt** on that function: real login (Supabase Auth) + server role check before anything renders, 30-min idle sign-out, confirmation dialogs with required reasons, loading/error/empty states. Roles are read-only in the UI; grant staff access via SQL only (prevents browser privilege escalation).
- **Pages shown as "not available" instead of faked:** notifications, analytics beyond live counts, crash monitoring, manual verification review, app settings (reasons listed on `/admin/operations`).
- **Delete account:** sign in (password or Google) → type DELETE → calls the app's existing `delete-account` function with the user's own JWT (same process as in-app). Identity comes only from the JWT.
- **Legal pages:** privacy policy rewritten to match the app's actual data and the retention matrix in `docs/ACCOUNT_DELETION.md`; unsupported claims removed; support form now opens a pre-filled email instead of faking submission; `/contact` added; footer links added; security headers + noindex for admin.

## 3. Environment variables (names only)
Website: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, optional `NEXT_PUBLIC_SUPPORT_EMAIL`.
Edge Function secrets: `ADMIN_ALLOWED_ORIGINS` (e.g. `https://your-site.example`). `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` are injected by Supabase.

## 4. Deploy
```bash
# one-time: grant staff access (SQL editor; replace the UUID of the staff member's auth user)
insert into public.user_roles (user_id, role) values ('<auth-user-uuid>', 'admin') on conflict do nothing;

supabase secrets set ADMIN_ALLOWED_ORIGINS=https://your-site.example --project-ref <ref>
supabase functions deploy admin-api --project-ref <ref>        # keep JWT verification ON
supabase functions deploy delete-account --project-ref <ref>   # from the app repo, if not yet deployed
# Supabase Auth > URL configuration: add https://your-site.example/delete-account to redirect URLs (Google sign-in)

npm install
npm run lint && npm test
NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=... npm run build
npm start        # or deploy to your host with the same two env vars
```

## 5. Tests
**Passed:** `tsc --noEmit`; `next build` (21 routes); 13 unit tests of the Edge Function logic (no auth → 401, non-staff → 403 on every action, moderator vs admin split, client role ignored, validation, no self/staff targeting, audit row written, revert on audit failure, rate limit, CORS allowlist); HTTP 200 on all public pages and `/admin-login`; security/noindex headers present; no secret in source or bundle.

**Could NOT be run (no access to your live project/credentials):** the Edge Function against the real database (not deployed by me); real login, role lookup, suspend/resolve and audit rows end to end; RLS / cross-user isolation checks (the app's own SQL tests under `supabase/tests` were not run); real account deletion and Google OAuth redirect; visual checks at mobile/desktop widths (not inspected in a browser); direct calls to the live function by a non-admin. Treat these as pending verification.

## 6. Remaining blockers / decisions
- Retention periods are undecided in the app docs; the policy says so honestly. Legal review of the policy, Terms and grievance turnaround claims (kept from the original) is needed — nothing here asserts DPDP/IT-Rules compliance.
- Suspension uses the app's two states (`active`/`suspended`); "ban", appeals, report assignment/priority do not exist in the backend.
- Subscription refunds must stay in Google Play Console. Push broadcast, analytics, crash reporting, settings editing and manual verification review need backend work first.
- Confirm `milodating2026@gmail.com` is the intended public support address (the old `support@/safety@chahat.app` were unverified).
