import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';
import { buildAlternates, ogAlternateLocales, ogLocale } from '@/utils/seo';

import LandingPageClient from './LandingPageClient';

const HOME_PATH = '/';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const safeLocale = (AppConfig.locales as readonly string[]).includes(locale)
    ? (locale as (typeof AppConfig.locales)[number])
    : AppConfig.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: 'Metadata' });
  const alternates = buildAlternates(safeLocale, HOME_PATH);

  return {
    metadataBase: new URL(getBaseUrl()),
    title: t('title'),
    description: t('description'),
    alternates,
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: alternates.canonical,
      siteName: AppConfig.name,
      locale: ogLocale(safeLocale),
      alternateLocale: ogAlternateLocales(safeLocale),
      type: 'website',
    },
  };
}

const HomePage = async (props: { params: Promise<{ locale: string }> }) => {
  setRequestLocale((await props.params).locale);
  return <LandingPageClient />;
};

export default HomePage;
