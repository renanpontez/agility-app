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

// Always render at request time.
//
// We tried `revalidate = 60` + `revalidatePath('/bio')` from the publish hook,
// but ran into a structural issue: at build time, the Vercel build runner
// can't reach Postgres, so `getPostsSafe` falls back to the bundled JSON seed.
// That seed-based HTML gets cached as the initial PRERENDER. Subsequent
// `revalidatePath` calls only INVALIDATE — a real new render only happens on
// the next user request, which means the first visitor after a publish still
// sees the stale prerender. For the pt-BR /bio that gets traffic, that's
// quickly replaced; for /en/bio it stuck for hours.
//
// `force-dynamic` skips the prerender entirely and reads Postgres on every
// request. The query is one indexed SELECT against a single JSONB row, well
// under 50ms — invisible for a low-traffic Instagram landing.
export const dynamic = 'force-dynamic';

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
