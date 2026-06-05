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
