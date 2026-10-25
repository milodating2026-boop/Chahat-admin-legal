// Browser-safe Supabase client. ONLY the public project URL and the publishable/anon key belong here.
// Never put a service-role key in any NEXT_PUBLIC_* variable or client file.
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true } }) : null;

export const isSupabaseConfigured = Boolean(supabase);
