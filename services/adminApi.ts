import { supabase } from './supabase';

export class AdminApiError extends Error {
  constructor(public code: string, public status?: number) { super(code); }
}

/** Every privileged call goes to the admin-api Edge Function, which re-checks the caller's role server-side. */
export async function callAdmin<T = any>(action: string, params: Record<string, unknown> = {}): Promise<T> {
  if (!supabase) throw new AdminApiError('not_configured');
  const { data, error } = await supabase.functions.invoke('admin-api', { body: { action, ...params } });
  if (error) {
    let code = 'request_failed';
    let status: number | undefined;
    const res = (error as any).context;
    if (res && typeof res.json === 'function') {
      status = res.status;
      try { code = (await res.json())?.error ?? code; } catch { /* keep default */ }
    }
    throw new AdminApiError(code, status);
  }
  return data as T;
}

export const friendlyError = (e: unknown) => {
  const c = e instanceof AdminApiError ? e.code : 'request_failed';
  const map: Record<string, string> = {
    forbidden: 'You do not have permission for this action.',
    unauthenticated: 'Your session has expired. Please sign in again.',
    rate_limited: 'Too many requests. Please wait a minute.',
    reason_required: 'A reason of at least 3 characters is required.',
    note_required: 'A note of at least 3 characters is required.',
    cannot_target_self: 'You cannot act on your own account.',
    cannot_target_staff: 'Staff accounts cannot be moderated here.',
    not_found: 'Record not found.',
    not_found_or_already_resolved: 'This report was already resolved.',
    not_configured: 'Supabase is not configured for this deployment.',
    server_not_configured: 'The admin-api function is missing its server configuration.',
    invalid_user: 'That member could not be found.',
    verification_not_pending: 'Only a pending verification can be approved.',
    ad_fields_required: 'Advertiser and headline are required.',
    ad_url_must_be_https: 'The ad link must start with https://',
    ad_dates_invalid: 'The end date must be after the start date.',
    invalid_image: 'Use a JPEG, PNG or WEBP image.',
    image_too_large: 'The image must be 1 MB or smaller.',
    announcement_text_invalid: 'Title (up to 60 characters) and message (up to 200) are required.',
    invalid_dates: 'Choose a valid date range.',
    invalid_email: 'Enter a valid email address.',
    no_account_for_email: 'No Chahat account uses that email. The person must sign up (or sign in once) first.',
  };
  return map[c] ?? 'Request failed. Check that the admin-api function is deployed.';
};
