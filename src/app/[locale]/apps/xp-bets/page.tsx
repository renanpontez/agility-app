import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AppConfig } from '@/utils/AppConfig';
import { buildAlternates, localizedUrl, ogAlternateLocales, ogLocale } from '@/utils/seo';

import XpBetsExperience from './XpBetsExperience';

type LocaleKey = (typeof AppConfig.locales)[number];

const safeLocale = (locale: string): LocaleKey =>
  (AppConfig.locales as readonly string[]).includes(locale)
    ? (locale as LocaleKey)
    : AppConfig.defaultLocale;

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const lc = safeLocale(locale);
  const t = await getTranslations({ locale: lc, namespace: 'xpBets.meta' });
  const alternates = buildAlternates(lc, '/apps/xp-bets');
  return {
    title: t('title'),
    description: t('description'),
    alternates,
    robots: { index: true, follow: true },
    openGraph: {
      title: t('title'),
      description: t('ogDescription'),
      url: localizedUrl(lc, '/apps/xp-bets'),
      type: 'website',
      locale: ogLocale(lc),
      alternateLocale: ogAlternateLocales(lc),
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('ogDescription'),
    },
  };
}

export default async function XpBetsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(safeLocale(locale));
  return <XpBetsExperience />;
}
