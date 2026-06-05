'use client';

import classNames from 'classnames';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';

import { usePathname, useRouter } from '@/libs/i18nNavigation';
import { AppConfig } from '@/utils/AppConfig';

import { BrazilFlag, UsFlag } from './flags';

const LOCALE_META: Record<
  (typeof AppConfig.locales)[number],
  { label: string; ariaLabel: string; Flag: ({ className }: { className?: string }) => React.JSX.Element }
> = {
  'pt-BR': { label: 'BR', ariaLabel: 'Mudar para português do Brasil', Flag: BrazilFlag },
  'en': { label: 'EN', ariaLabel: 'Switch to English', Flag: UsFlag },
};

type LocaleSwitcherTheme = 'light' | 'dark';

type LocaleSwitcherProps = {
  className?: string;
  theme?: LocaleSwitcherTheme;
};

const THEME_STYLES: Record<LocaleSwitcherTheme, {
  container: string;
  active: string;
  inactive: string;
}> = {
  dark: {
    container: 'border-white/10 bg-white/[0.04]',
    active: 'bg-white/15 text-white',
    inactive: 'text-white/60 hover:bg-white/[0.06] hover:text-white',
  },
  light: {
    container: 'border-black/[0.08] bg-black/[0.03]',
    active: 'bg-black/[0.08] text-neutral-900',
    inactive: 'text-neutral-500 hover:bg-black/[0.04] hover:text-neutral-900',
  },
};

// One year — long enough that the choice survives the typical "remember-me"
// session but short enough that abandoned browsers eventually reset.
const PREFERRED_LOCALE_TTL_SECONDS = 60 * 60 * 24 * 365;

const persistLocaleChoice = (locale: (typeof AppConfig.locales)[number]) => {
  if (typeof window === 'undefined') {
    return;
  }
  // localStorage is per the user's request — handy for client-only reads.
  try {
    window.localStorage.setItem('preferredLocale', locale);
  } catch {
    // Storage can be blocked (private mode, quota). Fall through to cookie.
  }
  // Cookie is what the middleware reads on subsequent SSR requests.
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${PREFERRED_LOCALE_TTL_SECONDS}; samesite=lax`;
};

const LocaleSwitcher = ({ className, theme = 'dark' }: LocaleSwitcherProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const activeLocale = useLocale();
  const [isPending, startTransition] = useTransition();
  const styles = THEME_STYLES[theme];

  const handleSelect = (nextLocale: (typeof AppConfig.locales)[number]) => {
    if (nextLocale === activeLocale || isPending) {
      return;
    }
    // Persist before navigating so the cookie is in flight by the time
    // the SSR request for the new URL hits the middleware.
    persistLocaleChoice(nextLocale);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div
      className={classNames(
        'flex items-center gap-1 rounded-full border p-0.5',
        styles.container,
        className,
      )}
      role="group"
      aria-label="Language selector"
    >
      {AppConfig.locales.map((locale) => {
        const meta = LOCALE_META[locale];
        if (!meta) {
          return null;
        }
        const { label, ariaLabel, Flag } = meta;
        const isActive = locale === activeLocale;
        return (
          <button
            key={locale}
            type="button"
            aria-label={ariaLabel}
            aria-pressed={isActive}
            disabled={isPending}
            onClick={() => handleSelect(locale)}
            className={classNames(
              'flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold transition-colors',
              isActive ? styles.active : styles.inactive,
            )}
          >
            <Flag className="size-4" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LocaleSwitcher;
