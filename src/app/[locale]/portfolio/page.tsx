import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import type { PortfolioItem } from '@/components/landing-v2';
import { PageHero, PortfolioGrid } from '@/components/landing-v2';
import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';
import { buildAlternates, ogAlternateLocales, ogLocale } from '@/utils/seo';

const PORTFOLIO_PATH = '/portfolio';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const safeLocale = (AppConfig.locales as readonly string[]).includes(locale)
    ? (locale as (typeof AppConfig.locales)[number])
    : AppConfig.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: 'PortfolioPage' });
  const alternates = buildAlternates(safeLocale, PORTFOLIO_PATH);
  const title = `${t('titlePrefix')} ${t('titleHighlight')}`.trim();

  return {
    metadataBase: new URL(getBaseUrl()),
    title,
    description: t('subtitle'),
    alternates,
    openGraph: {
      title,
      description: t('subtitle'),
      url: alternates.canonical,
      siteName: AppConfig.name,
      locale: ogLocale(safeLocale),
      alternateLocale: ogAlternateLocales(safeLocale),
      type: 'website',
    },
  };
}

const PortfolioPage = async () => {
  const t = await getTranslations('PortfolioPage');

  const PORTFOLIO: PortfolioItem[] = [
    {
      name: 'Circle Picks',
      category: t('portfolio_circlepicks_category'),
      type: 'App',
      description: t('portfolio_circlepicks_description'),
      image: 'https://placehold.co/800x600/1a1a2e/FD512E/png?text=Circle+Picks',
      slug: 'circlepicks',
    },
    {
      name: 'myhouz',
      category: t('portfolio_myhouz_category'),
      type: 'App',
      description: t('portfolio_myhouz_description'),
      image: 'https://placehold.co/800x600/1a1a2e/4F46E5/png?text=myhouz',
      slug: 'myhouz',
    },
    {
      name: 'Dra. Barbarela Freire',
      category: t('portfolio_dra_category'),
      type: 'Site',
      description: t('portfolio_dra_description'),
      image: '/assets/images/portfolio/dra-barbarela-freire/thumbnail.png',
      slug: 'dra-barbarela-freire',
    },
    {
      name: 'MR Advogados',
      category: t('portfolio_mr_category'),
      type: 'Site',
      description: t('portfolio_mr_description'),
      image: '/assets/images/portfolio/mr-advogados/thumbnail.webp',
      slug: 'mr-advogados',
    },
    {
      name: 'EasyToLive',
      category: t('portfolio_easy_category'),
      type: 'App',
      description: t('portfolio_easy_description'),
      image: '/assets/images/portfolio/easytolive_cover.webp',
      slug: 'easytolive',
    },
    {
      name: 'Academia Cearense de Economia',
      category: t('portfolio_academia_category'),
      type: 'Site',
      description: t('portfolio_academia_description'),
      image: '/assets/images/portfolio/academia_cover.webp',
      slug: 'academia-cearense-de-economia',
    },
    {
      name: 'Agillock',
      category: t('portfolio_agillock_category'),
      type: 'Landing Page',
      description: t('portfolio_agillock_description'),
      image: '/assets/images/portfolio/agillock_cover.webp',
      slug: 'agillock',
    },
    {
      name: 'Agility',
      category: t('portfolio_agility_category'),
      type: 'Design',
      description: t('portfolio_agility_description'),
      image: '/assets/images/portfolio/agility/thumbnail.webp',
      slug: 'agility',
    },
    {
      name: 'Dynotest',
      category: t('portfolio_dynotest_category'),
      type: 'Site',
      description: t('portfolio_dynotest_description'),
      image: '/assets/images/portfolio/dynotest_cover.webp',
      slug: 'dynotest',
    },
  ];

  return (
    <div>
      <PageHero
        badge={t('badge')}
        title={(
          <>
            {t('titlePrefix')}
            {' '}
            <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('titleHighlight')}
            </span>
          </>
        )}
        subtitle={t('subtitle')}
      />

      <PortfolioGrid items={PORTFOLIO} />
    </div>
  );
};

export default PortfolioPage;
