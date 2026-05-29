import { createNavigation } from 'next-intl/navigation';

import { AppConfig } from '@/utils/AppConfig';

export const { usePathname, useRouter, Link, redirect, getPathname } = createNavigation({
  locales: AppConfig.locales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});
