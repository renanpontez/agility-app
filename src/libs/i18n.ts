import { getRequestConfig } from 'next-intl/server';

import { AppConfig } from '@/utils/AppConfig';

// Using internationalization in Server Components (next-intl v4)
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !AppConfig.locales.includes(locale as (typeof AppConfig.locales)[number])) {
    locale = AppConfig.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
