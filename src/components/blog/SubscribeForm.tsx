'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';

type SubmitState
  = | { kind: 'idle' }
    | { kind: 'submitting' }
    | { kind: 'success' }
    | { kind: 'error'; message: string };

type SubscribeFormProps = {
  source?: string;
  variant?: 'full' | 'sidebar';
};

// Server should answer the subscribe POST well under a second. If we don't
// hear back within 5s, treat it as a failure — the user shouldn't be left
// staring at a spinner forever (Resend timeout, cold start, dropped connection).
const SUBMIT_TIMEOUT_MS = 5000;

// Most-used domains for the pt-BR audience, ranked by share. Static list for
// now — once we have signup data we can re-rank from analytics.
const EMAIL_DOMAINS = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com.br',
  'yahoo.com',
  'icloud.com',
  'live.com',
  'uol.com.br',
  'bol.com.br',
  'terra.com.br',
  'proton.me',
];
const MAX_SUGGESTIONS = 5;

const getDomainSuggestions = (value: string): string[] => {
  const at = value.indexOf('@');
  if (at < 1) {
    return [];
  }
  const localPart = value.slice(0, at);
  const domainPart = value.slice(at + 1).toLowerCase();
  // Once the user has typed a `.` in the domain, they're committing to a
  // specific TLD — suggesting completions would just get in the way.
  if (domainPart.includes('.')) {
    return [];
  }
  return EMAIL_DOMAINS
    .filter(d => d.startsWith(domainPart))
    .slice(0, MAX_SUGGESTIONS)
    .map(d => `${localPart}@${d}`);
};

const COPY = {
  eyebrow: 'Receba no e-mail',
  title: 'Novos artigos toda semana',
  subtitle:
    'Conteúdo curto sobre tecnologia, IA e bastidores do time. Sem spam, com link para cancelar em todo e-mail.',
  emailLabel: 'Seu melhor e-mail',
  cta: 'Assinar',
  ctaLoading: 'Enviando…',
  successTitle: 'Falta um clique para confirmar',
  successBodyStrong: 'Abra seu e-mail agora e clique em',
  successBodyButton: 'Confirmar inscrição',
  successBodyTail:
    '. Sem esse clique a inscrição não vale — exigência da LGPD e dos provedores de e-mail.',
  successFootnote:
    'Não chegou em alguns minutos? Confira a pasta de spam ou tente assinar de novo.',
  errorGeneric: 'Algo deu errado. Tente de novo em alguns minutos.',
  errorTimeout: 'A confirmação demorou demais. Tente de novo.',
  invalidEmail: 'Esse e-mail parece inválido.',
  privacy: 'Você pode cancelar a inscrição a qualquer momento.',
};

const SubscribeForm = ({ source = 'blog-index', variant = 'full' }: SubscribeFormProps) => {
  const isSidebar = variant === 'sidebar';
  const [email, setEmail] = useState('');
  const [state, setState] = useState<SubmitState>({ kind: 'idle' });
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const suggestions = useMemo(() => getDomainSuggestions(email), [email]);
  const showSuggestions = focused && !dismissed && suggestions.length > 0;

  useEffect(() => {
    setHighlight(-1);
  }, [email]);

  const acceptSuggestion = (value: string) => {
    setEmail(value);
    setDismissed(true);
    setHighlight(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) {
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlight(h => (h + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlight(h => (h <= 0 ? suggestions.length - 1 : h - 1));
    } else if (event.key === 'Enter' && highlight >= 0) {
      event.preventDefault();
      acceptSuggestion(suggestions[highlight]!);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setDismissed(true);
      setHighlight(-1);
    }
  };

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
    // Hard timeout via AbortController — without it the UI stays in
    // "Enviando…" indefinitely if the server hangs or the network drops.
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);
    try {
      const res = await fetch('/api/blog/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, source, locale: 'pt-BR' }),
        signal: controller.signal,
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
    } catch (err) {
      const aborted = err instanceof DOMException && err.name === 'AbortError';
      setState({
        kind: 'error',
        message: aborted ? COPY.errorTimeout : COPY.errorGeneric,
      });
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  if (state.kind === 'success') {
    return (
      <section
        className={
          isSidebar
            ? ''
            : 'mx-auto my-20 max-w-3xl rounded-3xl border border-stone-200/70 bg-white p-10 text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:p-14'
        }
      >
        <p className={`${isSidebar ? 'mb-3' : 'mb-4'} inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary`}>
          <span aria-hidden className="h-px w-8 bg-primary" />
          Verifique seu e-mail
        </p>
        <h2 className={
          isSidebar
            ? 'text-[17px] font-semibold leading-tight tracking-[-0.01em] text-stone-900'
            : 'text-2xl font-semibold leading-tight tracking-[-0.02em] text-stone-900 md:text-3xl'
        }
        >
          {COPY.successTitle}
        </h2>
        <p className={
          isSidebar
            ? 'mt-3 text-[13px] leading-relaxed text-stone-600'
            : 'mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-stone-600'
        }
        >
          {COPY.successBodyStrong}
          {' '}
          <span className="rounded-md bg-stone-900 px-2 py-0.5 text-[12px] font-medium text-stone-50">
            {COPY.successBodyButton}
          </span>
          {COPY.successBodyTail}
        </p>
        <p className={
          isSidebar
            ? 'mt-3 text-[11.5px] leading-relaxed text-stone-400'
            : 'mx-auto mt-5 max-w-md text-[12px] leading-relaxed text-stone-400'
        }
        >
          {COPY.successFootnote}
        </p>
      </section>
    );
  }

  return (
    <section
      className={
        isSidebar
          ? ''
          : 'mx-auto my-20 max-w-3xl rounded-3xl border border-stone-200/70 bg-white p-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:p-14'
      }
    >
      {isSidebar
        ? (
            <div>
              <h2 className="text-[17px] font-semibold leading-snug tracking-[-0.01em] text-stone-900">
                {COPY.title}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-stone-500">
                {COPY.subtitle}
              </p>
            </div>
          )
        : (
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
          )}

      <form onSubmit={handleSubmit} className={`${isSidebar ? 'mt-4 flex flex-col gap-2' : 'mt-8 flex flex-col gap-3 sm:flex-row'}`} noValidate>
        <label className="relative flex-1">
          <span className="sr-only">{COPY.emailLabel}</span>
          <input
            ref={inputRef}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder={COPY.emailLabel}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setDismissed(false);
              if (state.kind === 'error') {
                setState({ kind: 'idle' });
              }
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
            disabled={state.kind === 'submitting'}
            role="combobox"
            aria-controls={listboxId}
            aria-expanded={showSuggestions}
            aria-autocomplete="list"
            aria-activedescendant={
              showSuggestions && highlight >= 0 ? `${listboxId}-${highlight}` : undefined
            }
            aria-invalid={state.kind === 'error'}
            className={`w-full rounded-full border border-stone-200/70 bg-stone-100 text-stone-900 outline-none transition-colors placeholder:text-stone-400 hover:border-stone-300 focus:border-stone-400 focus:bg-white focus:ring-4 focus:ring-stone-900/5 ${
              isSidebar ? 'h-11 px-4 text-[14px]' : 'h-12 px-5 text-[15px]'
            }`}
          />
          {showSuggestions && (
            <ul
              id={listboxId}
              role="listbox"
              className="absolute inset-x-0 top-full z-10 mt-2 overflow-hidden rounded-2xl border border-stone-200/70 bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
            >
              {suggestions.map((s, i) => (
                <li
                  key={s}
                  id={`${listboxId}-${i}`}
                  role="option"
                  aria-selected={i === highlight}
                  onMouseDown={(e) => {
                    // mousedown — onClick would lose focus on the input
                    // before firing, dismissing the dropdown.
                    e.preventDefault();
                    acceptSuggestion(s);
                  }}
                  onMouseEnter={() => setHighlight(i)}
                  className={`cursor-pointer px-5 py-2 text-[14px] text-stone-700 ${
                    i === highlight ? 'bg-stone-100 text-stone-900' : ''
                  }`}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </label>
        <button
          type="submit"
          disabled={state.kind === 'submitting'}
          className={`inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 font-medium tracking-tight text-stone-50 shadow-[0_1px_2px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all hover:bg-stone-800 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.08)] disabled:cursor-not-allowed disabled:opacity-60 ${
            isSidebar ? 'h-11 px-5 text-[13px]' : 'h-12 px-6 text-[14px]'
          }`}
        >
          {state.kind === 'submitting' ? COPY.ctaLoading : COPY.cta}
          {state.kind !== 'submitting' && (
            <span aria-hidden className="text-stone-400">→</span>
          )}
        </button>
      </form>

      <div className={`mt-3 flex min-h-[20px] items-center text-[12px] ${isSidebar ? 'justify-start' : 'justify-center'}`}>
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
