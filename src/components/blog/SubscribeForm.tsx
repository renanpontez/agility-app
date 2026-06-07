'use client';

import { useState } from 'react';

type SubmitState
  = | { kind: 'idle' }
    | { kind: 'submitting' }
    | { kind: 'success' }
    | { kind: 'error'; message: string };

type SubscribeFormProps = {
  source?: string;
};

const COPY = {
  eyebrow: 'Receba no e-mail',
  title: 'Novos artigos toda semana',
  subtitle:
    'Conteúdo curto sobre tecnologia, IA e bastidores do time. Sem spam, com link para cancelar em todo e-mail.',
  emailLabel: 'Seu melhor e-mail',
  cta: 'Assinar',
  ctaLoading: 'Enviando…',
  successTitle: 'Falta um clique',
  successBody:
    'Mandamos um e-mail de confirmação. Abra sua caixa de entrada e confirme para começar a receber.',
  errorGeneric: 'Algo deu errado. Tente de novo em alguns minutos.',
  invalidEmail: 'Esse e-mail parece inválido.',
  privacy: 'Você pode cancelar a inscrição a qualquer momento.',
};

const SubscribeForm = ({ source = 'blog-index' }: SubscribeFormProps) => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<SubmitState>({ kind: 'idle' });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state.kind === 'submitting') {
      return;
    }
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(trimmed)) {
      setState({ kind: 'error', message: COPY.invalidEmail });
      return;
    }
    setState({ kind: 'submitting' });
    try {
      const res = await fetch('/api/blog/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, source, locale: 'pt-BR' }),
      });
      if (!res.ok) {
        const detail: { error?: string } = await res.json().catch(() => ({}));
        // We don't surface the specific error to the user; transient or
        // validation issues all read the same "try again" line.
        setState({
          kind: 'error',
          message: detail.error === 'invalid_request' ? COPY.invalidEmail : COPY.errorGeneric,
        });
        return;
      }
      setState({ kind: 'success' });
      setEmail('');
    } catch {
      setState({ kind: 'error', message: COPY.errorGeneric });
    }
  };

  if (state.kind === 'success') {
    return (
      <section className="mx-auto my-20 max-w-3xl rounded-3xl border border-stone-200/70 bg-white p-10 text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:p-14">
        <p className="mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
          <span aria-hidden className="h-px w-8 bg-primary" />
          {COPY.eyebrow}
        </p>
        <h2 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-stone-900 md:text-3xl">
          {COPY.successTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-stone-500">
          {COPY.successBody}
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto my-20 max-w-3xl rounded-3xl border border-stone-200/70 bg-white p-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:p-14">
      <div className="text-center">
        <p className="mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
          <span aria-hidden className="h-px w-8 bg-primary" />
          {COPY.eyebrow}
        </p>
        <h2 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-stone-900 md:text-[1.875rem]">
          {COPY.title}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-stone-500">
          {COPY.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row" noValidate>
        <label className="flex-1">
          <span className="sr-only">{COPY.emailLabel}</span>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder={COPY.emailLabel}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (state.kind === 'error') {
                setState({ kind: 'idle' });
              }
            }}
            disabled={state.kind === 'submitting'}
            aria-invalid={state.kind === 'error'}
            className="h-12 w-full rounded-full border border-stone-200/70 bg-stone-50 px-5 text-[15px] text-stone-900 outline-none transition-colors placeholder:text-stone-400 hover:border-stone-300 focus:border-stone-400 focus:bg-white focus:ring-4 focus:ring-stone-900/5"
          />
        </label>
        <button
          type="submit"
          disabled={state.kind === 'submitting'}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-stone-900 px-6 text-[14px] font-medium tracking-tight text-stone-50 shadow-[0_1px_2px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all hover:bg-stone-800 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.08)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state.kind === 'submitting' ? COPY.ctaLoading : COPY.cta}
          {state.kind !== 'submitting' && (
            <span aria-hidden className="text-stone-400">→</span>
          )}
        </button>
      </form>

      <div className="mt-4 flex min-h-[20px] items-center justify-center text-[12px]">
        {state.kind === 'error'
          ? (
              <p className="text-rose-600" role="alert">
                {state.message}
              </p>
            )
          : (
              <p className="text-stone-400">{COPY.privacy}</p>
            )}
      </div>
    </section>
  );
};

export default SubscribeForm;
