// Supabase Edge Function: admin-api. Deploy with JWT verification ON (default).
// Secrets: SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are injected by Supabase.
// Set ADMIN_ALLOWED_ORIGINS (comma separated, e.g. https://admin.example.com) via `supabase secrets set`.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { handleAdminApi } from "./handler.ts";

Deno.serve((req) => {
  const url = Deno.env.get("SUPABASE_URL");
  const anon = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  return handleAdminApi(req, {
    env: { url, anon, serviceKey, allowedOrigins: Deno.env.get("ADMIN_ALLOWED_ORIGINS") },
    makeUserClient: (authHeader) => createClient(url!, anon!, { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } }) as any,
    makeAdminClient: () => createClient(url!, serviceKey!, { auth: { persistSession: false, autoRefreshToken: false } }) as any,
  });
});
