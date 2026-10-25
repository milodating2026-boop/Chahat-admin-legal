-- ============================================================================
-- CHAHAT ONLINE FRIENDSHIP APP: SERVER-VERIFIED ADMIN AUTHORIZATION & RLS
-- Target: Supabase Cloud PostgreSQL
-- Description: Creates the protected admin_users allowlist, server-side
--              is_admin() validation functions, and strict RLS policies.
-- ============================================================================

-- 1. Create the dedicated administrative allowlist table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'moderator' CHECK (role IN ('super_admin', 'moderator', 'support', 'analyst')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    created_by TEXT,
    last_sign_in_at TIMESTAMPTZ
);

-- 2. CRITICAL SECURITY: Revoke all public write access
-- Regular users (anon or authenticated) cannot insert, update, or delete admin accounts
REVOKE ALL ON public.admin_users FROM anon, authenticated;
GRANT SELECT ON public.admin_users TO authenticated;

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 3. Server-enforced function: Check if caller is an active authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN false;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE (auth_user_id = auth.uid() OR lower(email) = lower(auth.jwt() ->> 'email'))
          AND is_active = true
    );
END;
$$;

-- 4. Server-enforced RPC function: Return caller's authorized admin role
CREATE OR REPLACE FUNCTION public.get_current_admin_role()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    admin_rec RECORD;
    caller_email TEXT;
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN jsonb_build_object(
            'authorized', false,
            'reason', 'unauthenticated'
        );
    END IF;

    caller_email := lower(auth.jwt() ->> 'email');

    SELECT * INTO admin_rec FROM public.admin_users
    WHERE (auth_user_id = auth.uid() OR lower(email) = caller_email)
      AND is_active = true
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'authorized', false,
            'reason', 'email_not_in_admin_allowlist'
        );
    END IF;

    -- Update last sign-in timestamp and link auth_user_id if not yet linked
    UPDATE public.admin_users 
    SET last_sign_in_at = timezone('utc', now()),
        auth_user_id = COALESCE(auth_user_id, auth.uid())
    WHERE id = admin_rec.id;

    RETURN jsonb_build_object(
        'authorized', true,
        'email', admin_rec.email,
        'role', admin_rec.role
    );
END;
$$;

-- 5. RLS Policy on admin_users: Admins can only view the admin allowlist if authorized
CREATE POLICY "Admins view admin list"
    ON public.admin_users FOR SELECT
    USING (public.is_admin());

-- ============================================================================
-- HOW TO DESIGNATE THE INITIAL SUPER ADMIN:
-- Run this single SQL query in your Supabase Dashboard > SQL Editor:
--
-- INSERT INTO public.admin_users (email, role, is_active, created_by)
-- VALUES ('akhtarsamir00@gmail.com', 'super_admin', true, 'system_bootstrap')
-- ON CONFLICT (email) DO UPDATE 
-- SET role = 'super_admin', is_active = true;
-- ============================================================================
