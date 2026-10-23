'use client';

import { useActionState } from 'react';
import { login, type LoginState } from '@/lib/family/login-action';

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-6 flex flex-col gap-3">
      <input type="hidden" name="next" value={next} />
      <label htmlFor="passcode" className="sr-only">
        Passcode
      </label>
      <input
        id="passcode"
        name="passcode"
        type="password"
        autoComplete="current-password"
        required
        autoFocus
        className="h-12 rounded-xl border border-border-default bg-background-secondary px-4 text-lg text-foreground-primary outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-xl bg-accent text-lg font-semibold text-background-primary disabled:opacity-60"
      >
        {pending ? 'Checking…' : 'Unlock'}
      </button>
      {state.error && (
        <p role="alert" className="text-sm text-red-400">
          {state.error}
        </p>
      )}
    </form>
  );
}
