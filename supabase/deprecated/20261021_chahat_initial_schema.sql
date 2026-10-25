-- ============================================================================
-- CHAHAT ONLINE FRIENDSHIP APP: DATABASE SCHEMA & RLS POLICIES
-- Target Environment: Supabase PostgreSQL 15+
-- Version: 2026.10.21-chahat-baseline
-- Description: Core schema, role-based authorization, security audit logging,
--              user privacy protection, and deletion compliance.
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. ENUMS & DOMAINS
-- ----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE admin_role_type AS ENUM ('owner', 'moderator', 'support', 'analyst');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE user_account_status AS ENUM ('active', 'suspended', 'banned', 'pending_verification', 'deleted');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE verification_state AS ENUM ('unverified', 'pending', 'verified', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE report_category_type AS ENUM ('harassment', 'impersonation', 'inappropriate_video', 'nudity', 'scam_spam', 'underage', 'other');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE report_status_type AS ENUM ('open', 'investigating', 'resolved', 'dismissed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 2. ADMIN ACCOUNTS & PERMISSIONS (Separated from regular public user accounts)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role admin_role_type NOT NULL DEFAULT 'moderator',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ----------------------------------------------------------------------------
-- 3. PROFILES TABLE (Core user information)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    age INT CHECK (age >= 18), -- Strictly 18+ enforcement
    gender TEXT,
    interested_in TEXT DEFAULT 'friendship',
    city TEXT,
    country TEXT DEFAULT 'India',
    bio TEXT,
    avatar_url TEXT,
    selfie_url TEXT,
    status user_account_status NOT NULL DEFAULT 'active',
    verification_status verification_state NOT NULL DEFAULT 'unverified',
    subscription_tier TEXT NOT NULL DEFAULT 'free',
    coins_balance INT NOT NULL DEFAULT 20 CHECK (coins_balance >= 0),
    strikes_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    fcm_token TEXT,
    device_info JSONB DEFAULT '{}'::jsonb
);

-- Indexing for discovery & moderation queries
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_verification ON public.profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles(city);

-- ----------------------------------------------------------------------------
-- 4. MATCHES & DISCOVERY
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_1 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_2 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    matched_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT unique_match_pair UNIQUE (user_1, user_2),
    CONSTRAINT no_self_match CHECK (user_1 <> user_2)
);

-- ----------------------------------------------------------------------------
-- 5. SAFETY & ABUSE REPORTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.abuse_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category report_category_type NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium',
    status report_status_type NOT NULL DEFAULT 'open',
    description TEXT NOT NULL,
    evidence_snippet TEXT,
    evidence_media_url TEXT, -- Secured private storage bucket
    assigned_moderator TEXT,
    resolution_note TEXT,
    action_taken TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_abuse_reports_status ON public.abuse_reports(status);
CREATE INDEX IF NOT EXISTS idx_abuse_reports_reported_user ON public.abuse_reports(reported_user_id);

-- ----------------------------------------------------------------------------
-- 6. SELFIE VERIFICATION REQUESTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    selfie_url TEXT NOT NULL, -- Private bucket
    gesture_required TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    rejection_reason TEXT,
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ----------------------------------------------------------------------------
-- 7. SUBSCRIPTIONS & TRANSACTIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscription_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    amount_in_cents INT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    provider TEXT NOT NULL,
    transaction_id TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    billing_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    expiry_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ----------------------------------------------------------------------------
-- 8. ACCOUNT DELETION COMPLIANCE QUEUE (External & In-App)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.account_deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'queued',
    ip_address TEXT,
    user_agent TEXT,
    deletion_summary JSONB,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    processed_at TIMESTAMPTZ,
    processed_by TEXT
);

-- ----------------------------------------------------------------------------
-- 9. IMMUTABLE SECURITY AUDIT LOGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL,
    admin_email TEXT NOT NULL,
    admin_role TEXT NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    target_description TEXT,
    ip_address TEXT,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Prevent unauthorized deletion or modification of audit records
REVOKE UPDATE, DELETE ON public.admin_audit_logs FROM PUBLIC;

-- ----------------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abuse_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;

-- Helper function: Is caller an approved admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_staff 
        WHERE auth_user_id = auth.uid() AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Public can read active non-banned profiles for discovery
CREATE POLICY "Public discovery active profiles"
    ON public.profiles FOR SELECT
    USING (status = 'active' OR auth.uid() = id OR public.is_admin());

-- Profiles: User can update their own profile
CREATE POLICY "Users update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Abuse Reports: Users can insert reports against others
CREATE POLICY "Users submit abuse reports"
    ON public.abuse_reports FOR INSERT
    WITH CHECK (auth.uid() = reporter_id);

-- Abuse Reports: Only Admins can view and moderate reports
CREATE POLICY "Admins manage abuse reports"
    ON public.abuse_reports FOR ALL
    USING (public.is_admin());

-- Verification Requests: Users can view own; Admins can review all
CREATE POLICY "Users view own verification"
    ON public.verification_requests FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins review verifications"
    ON public.verification_requests FOR UPDATE
    USING (public.is_admin());

-- Audit logs: Read-only for authorized Admin accounts
CREATE POLICY "Admins view audit logs"
    ON public.admin_audit_logs FOR SELECT
    USING (public.is_admin());
