import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { blogArticlePath } from '@/components/blog/blogUrls';
import { slugifyCategory } from '@/components/blog/categories';
import { getPostsSafe } from '@/libs/blogStore';
import { isPublished } from '@/types/blog';
import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';
import { buildAlternates, ogAlternateLocales, ogLocale } from '@/utils/seo';

import type { LatestPostSummary } from './page.client';
import BioPageClient from './page.client';

// Bio page is mostly static — refresh every minute as a safety net. The real
// refresh happens via `revalidatePath('/bio')` called from the blog publish
// hook (see src/app/api/blog/route.ts), so new articles surface here within
// a single request after going live.
export const revalidate = 60;

type Params = { locale: string };

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const safeLocale = (AppConfig.locales as readonly string[]).includes(locale)
    ? (locale as (typeof AppConfig.locales)[number])
    : AppConfig.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: 'BioPage' });
  const alternates = buildAlternates(safeLocale, '/bio');

  return {
    metadataBase: new URL(getBaseUrl()),
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates,
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: alternates.canonical,
      siteName: AppConfig.name,
      locale: ogLocale(safeLocale),
      alternateLocale: ogAlternateLocales(safeLocale),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metaTitle'),
      description: t('metaDescription'),
    },
  };
}

const pickLatestPost = async (locale: string): Promise<LatestPostSummary | null> => {
  // Fail-soft: if Postgres is unreachable the bio page must still render —
  // it's the link in our Instagram bio, can't afford a 500. getPostsSafe
  // falls back to the bundled JSON snapshot.
  const posts = (await getPostsSafe()).filter(isPublished);
  if (posts.length === 0) {
    return null;
  }
  const sorted = [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  const post = sorted[0]!;
  const dateLabel = new Intl.DateTimeFormat(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
    day: 'numeric',
    month: 'short',
  })
    .format(new Date(post.publishedAt))
    .replace('.', '')
    .toUpperCase();
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    coverAlt: post.coverAlt,
    category: post.category,
    categorySlug: post.category ? slugifyCategory(post.category) : undefined,
    dateLabel,
    readingTimeMinutes: post.readingTimeMinutes,
    href: blogArticlePath(post),
  };
};

export default async function BioPage(props: { params: Promise<Params> }) {
  const { locale } = await props.params;
  const safeLocale = (AppConfig.locales as readonly string[]).includes(locale)
    ? (locale as (typeof AppConfig.locales)[number])
    : AppConfig.defaultLocale;
  const latestPost = await pickLatestPost(safeLocale);
  return <BioPageClient latestPost={latestPost} />;
}
