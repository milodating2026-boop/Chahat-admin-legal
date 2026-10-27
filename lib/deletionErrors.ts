// Message shown on /delete-account when the delete-account Edge Function call does not report success.
// A 401 can mean the session expired OR that a previous attempt already deleted the Auth user (its JWT no
// longer resolves), so it must not be reported as a plain "did not finish".

export const SESSION_GONE_MESSAGE =
  'Your session is no longer valid. If a previous attempt already finished, your account is gone: try signing in again, and if sign-in fails the deletion is complete. Otherwise sign out, sign in and retry.';

export const DELETION_INCOMPLETE_MESSAGE =
  'Deletion did not finish. Your account is still signed in and may be suspended; press the button again to retry, or contact support.';

export function deletionFailureMessage(error: unknown): string {
  const status = (error as { context?: { status?: unknown } } | null | undefined)?.context?.status;
  return status === 401 ? SESSION_GONE_MESSAGE : DELETION_INCOMPLETE_MESSAGE;
}
