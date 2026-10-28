'use client';

// Shown instead of a blank white page if something unexpected fails on /delete-account.
export default function DeleteAccountError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div role="alert" className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 space-y-4">
        <p className="font-bold text-slate-900 dark:text-white">Something went wrong on our side.</p>
        <p>Your account has not been changed. Please try again. If the problem continues, contact our support team and we will help you.</p>
        <button onClick={reset} className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold">Try again</button>
      </div>
    </main>
  );
}
