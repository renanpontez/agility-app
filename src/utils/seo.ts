import { AppConfig } from './AppConfig';
import { getBaseUrl } from './Helpers';

type Locale = (typeof AppConfig.locales)[number];

/**
 * Build the absolute URL for a path in a given locale, respecting the
 * `as-needed` prefix strategy (default locale = no prefix, others = /<locale>/...).
 */
export const localizedPath = (locale: Locale, path: string) => {
  const normalised = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  if (locale === AppConfig.defaultLocale) {
    return normalised || '/';
  }
  return `/${locale}${normalised}` || `/${locale}`;
};

export const localizedUrl = (locale: Locale, path: string) => `${getBaseUrl()}${localizedPath(locale, path)}`;

/**
 * Build the `alternates` block for Next.js Metadata, including a canonical for
 * the supplied locale and `hrefLang` entries for every supported locale plus
 * `x-default` (which points at the default-locale variant).
 */
export const buildAlternates = (locale: Locale, path: string) => {
  const languages: Record<string, string> = {};
  for (const lc of AppConfig.locales) {
    languages[lc] = localizedPath(lc, path);
  }
  languages['x-default'] = localizedPath(AppConfig.defaultLocale, path);
  return {
    canonical: localizedPath(locale, path),
    languages,
  };
};

/**
 * Open Graph locale tag for the chosen UI locale.
 * Maps the project's locale strings to Open Graph's `language_TERRITORY` form.
 */
export const ogLocale = (locale: Locale) => {
  const map: Record<string, string> = {
    'pt-BR': 'pt_BR',
    'en': 'en_US',
  };
  return map[locale] ?? 'en_US';
};

export const ogAlternateLocales = (locale: Locale) =>
  AppConfig.locales.filter(lc => lc !== locale).map(ogLocale);
