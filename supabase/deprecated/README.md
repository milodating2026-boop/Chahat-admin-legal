# DO NOT APPLY

These two files were the website's original migrations. They create tables that duplicate or conflict with the
Android app's real backend (`admin_users`, `admin_staff`, `abuse_reports`, `admin_audit_logs`, `subscription_ledger`,
`account_deletion_requests`, and `CREATE TABLE IF NOT EXISTS public.profiles`). The shared Supabase project already
has `user_roles`, `profiles`, `reports`, `admin_audit`, `user_subscriptions` and `subscription_orders`.
The website now uses those through the `admin-api` Edge Function; no website migration is required.
