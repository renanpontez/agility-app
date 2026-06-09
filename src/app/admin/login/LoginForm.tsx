'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const LoginForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') ?? '/admin/subscribers';

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) {
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, password, next }),
      });
      if (res.status === 503) {
        setError('Admin desativado. Configure ADMIN_USER e ADMIN_PASSWORD.');
        return;
      }
      if (!res.ok) {
        setError('Usuário ou senha inválidos.');
        return;
      }
      const data = (await res.json()) as { next?: string };
      router.replace(data.next ?? '/admin/subscribers');
      router.refresh();
    } catch {
      setError('Não foi possível entrar. Tente de novo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] font-medium text-stone-600">Usuário</span>
        <input
          type="text"
          autoComplete="username"
          required
          value={user}
          onChange={e => setUser(e.target.value)}
          disabled={submitting}
          className="h-11 rounded-xl border border-stone-200/70 bg-stone-50 px-4 text-[14px] text-stone-900 outline-none transition-colors hover:border-stone-300 focus:border-stone-400 focus:bg-white focus:ring-4 focus:ring-stone-900/5"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] font-medium text-stone-600">Senha</span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={submitting}
          className="h-11 rounded-xl border border-stone-200/70 bg-stone-50 px-4 text-[14px] text-stone-900 outline-none transition-colors hover:border-stone-300 focus:border-stone-400 focus:bg-white focus:ring-4 focus:ring-stone-900/5"
        />
      </label>
      {error
        ? <p className="text-[12px] text-rose-600" role="alert">{error}</p>
        : null}
      <button
        type="submit"
        disabled={submitting}
        className="mt-2 inline-flex h-11 items-center justify-center rounded-xl bg-stone-900 px-5 text-[14px] font-medium text-stone-50 transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
};

export default LoginForm;
