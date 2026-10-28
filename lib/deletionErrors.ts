// Message shown on /delete-account when the delete-account Edge Function call does not report success.
// A 401 can mean the session expired OR that a previous attempt already deleted the Auth user (its JWT no
// longer resolves), so it must not be reported as a plain "did not finish".

export const SESSION_GONE_MESSAGE =
  'Your session is no longer valid. If a previous attempt already finished, your account is gone: try signing in again, and if sign-in fails the deletion is complete. Otherwise sign out, sign in and retry.';

export const DELETION_INCOMPLETE_MESSAGE =
  'Deletion did not finish. Your account is still signed in and may be suspended; press the button again to retry. If it still fails here, you can delete your account directly from the Chahat app (Settings / Account), or contact support.';

export function deletionFailureMessage(error: unknown): string {
  const status = (error as { context?: { status?: unknown } } | null | undefined)?.context?.status;
  return status === 401 ? SESSION_GONE_MESSAGE : DELETION_INCOMPLETE_MESSAGE;
}

// Reads the real reason out of a supabase-js FunctionsHttpError / FunctionsFetchError so the page can show it.
// Never throws. Returns e.g. "HTTP 404: Function not found" or "Network/CORS error: Failed to send a request...".
export async function deletionErrorDetail(error: unknown): Promise<string> {
  try {
    const e = error as { name?: string; message?: string; context?: unknown } | null | undefined;
    if (!e) return '';
    const ctx = e.context as { status?: number; clone?: () => { text: () => Promise<string> }; text?: () => Promise<string> } | undefined;
    if (ctx && typeof ctx.status === 'number') {
      let body = '';
      try { body = await (ctx.clone ? ctx.clone().text() : ctx.text!()); } catch { /* ignore */ }
      let msg = body;
      try { const j = JSON.parse(body); msg = j.error || j.message || j.msg || body; } catch { /* plain text */ }
      return `HTTP ${ctx.status}${msg ? `: ${String(msg).slice(0, 200)}` : ''}`;
    }
    if (e.name === 'FunctionsFetchError') return `Network/CORS error: ${e.message ?? 'request could not be sent'}`;
    return e.message ? String(e.message).slice(0, 200) : '';
  } catch {
    return '';
  }
}
