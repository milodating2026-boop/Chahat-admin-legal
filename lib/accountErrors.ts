// Plain-language messages for the /delete-account flow. Raw provider/server text is never shown to users.
export const SUPPORT_HINT = 'If you need help, contact our support team and we will assist you.';

type AuthErr = { code?: string; status?: number; message?: string; name?: string } | null | undefined;

const isNetwork = (e: AuthErr) => /fetch|network|failed to send|load failed/i.test(`${e?.message ?? ''} ${e?.name ?? ''}`);

/** Step 1: asking for a sign-in code. */
export function friendlySendCodeError(e: AuthErr): string {
  if (isNetwork(e)) return 'We could not reach our servers. Please check your internet connection and try again.';
  if (e?.status === 429 || /rate.?limit|too many|security purposes/i.test(`${e?.code ?? ''} ${e?.message ?? ''}`))
    return 'Too many requests. Please wait a minute before asking for another code.';
  return 'We could not send a code right now. Please try again in a few minutes.';
}

/** Step 2: checking the code. */
export function friendlyVerifyError(e: AuthErr): string {
  if (isNetwork(e)) return 'We could not reach our servers. Please check your internet connection and try again.';
  if (e?.status === 429) return 'Too many attempts. Please wait a minute and try again.';
  return 'That code is incorrect or has expired. Check the latest email we sent you, or request a new code.';
}

/** Google redirect returned with an error in the URL. */
export function friendlyOAuthReturnError(raw: string | null | undefined): string {
  if (/access_denied/i.test(raw ?? '')) return 'Google sign-in was cancelled. You can try again.';
  return 'Google sign-in could not be completed. Please try again, or contact support if it keeps happening.';
}

/** Submitting the deletion request. `error` comes from supabase.functions.invoke. */
export function friendlyRequestError(error: unknown, status?: number): string {
  const e = error as AuthErr;
  if (status === 401) return 'Your sign-in session has expired. Please sign in again to continue.';
  if (status === 429) return 'Too many requests. Please wait a few minutes and try again.';
  if (e && isNetwork(e) && !status) return 'We could not reach our servers. Please check your internet connection and try again.';
  return `We could not submit your request right now. Please try again in a few minutes. You can also delete your account inside the Chahat app (Settings → Account → Delete account). ${SUPPORT_HINT}`;
}

export type RequestResult = { success?: boolean; status?: string; duplicate?: boolean } | null | undefined;

/** Success wording by outcome. */
export function successMessage(r: RequestResult): { title: string; body: string } {
  if (r?.status === 'completed')
    return { title: 'Your account has been deleted.', body: 'Your profile and personal data have been removed as described above.' };
  return {
    title: r?.duplicate ? 'Your request is already in progress.' : 'Your deletion request has been received.',
    body: 'We are processing it now and will remove your account and personal data. You do not need to do anything else.',
  };
}
