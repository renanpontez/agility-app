import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import type { BlogCardItem } from '@/components/blog';
import { BlogHero, BlogIndex, getOrderedCategories } from '@/components/blog';
import { getPostsSafe } from '@/libs/blogStore';
import { isPublished } from '@/types/blog';
import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';
import { buildAlternates, localizedUrl, ogAlternateLocales, ogLocale } from '@/utils/seo';

export const dynamic = 'force-dynamic';

const BLOG_PATH = '/blog';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const safeLocale = (AppConfig.locales as readonly string[]).includes(locale)
    ? (locale as (typeof AppConfig.locales)[number])
    : AppConfig.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: 'BlogPage' });
  const alternates = buildAlternates(safeLocale, BLOG_PATH);
  const title = `${t('titlePrefix')} ${t('titleHighlight')}`.trim();

  return {
    metadataBase: new URL(getBaseUrl()),
    title,
    description: t('subtitle'),
    keywords: ['product', 'design', 'engineering', 'agility creative', 'blog'],
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
    twitter: {
      card: 'summary_large_image',
      title,
      description: t('subtitle'),
    },
  };
}

const BlogPage = async (props: { params: Promise<{ locale: string }> }) => {
  const { locale } = await props.params;
  const safeLocale = (AppConfig.locales as readonly string[]).includes(locale)
    ? (locale as (typeof AppConfig.locales)[number])
    : AppConfig.defaultLocale;
  const t = await getTranslations('BlogPage');

  const posts = await getPostsSafe();
  const sortedPosts = posts
    .filter(isPublished)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const items: BlogCardItem[] = sortedPosts.map(post => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    coverAlt: post.coverAlt,
    category: post.category,
    publishedAt: post.publishedAt,
    readingTimeMinutes: post.readingTimeMinutes,
  }));

  const categories = getOrderedCategories(sortedPosts);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': `Agility Creative — ${t('titlePrefix')} ${t('titleHighlight')}`,
    'description': t('subtitle'),
    'url': localizedUrl(safeLocale, BLOG_PATH),
    'inLanguage': safeLocale,
    'blogPost': items.map(item => ({
      '@type': 'BlogPosting',
      'headline': item.title,
      'description': item.excerpt,
      'datePublished': item.publishedAt,
      'url': localizedUrl(safeLocale, `/blog/${item.slug}`),
      'image': item.coverImage,
    })),
  };

  return (
    <>
      <BlogHero
        eyebrow={t('badge')}
        title={(
          <>
            {t('titlePrefix')}
            {' '}
            <span className="text-primary">{t('titleHighlight')}</span>
          </>
        )}
        subtitle={t('subtitle')}
      />

      <BlogIndex
        items={items}
        categories={categories}
        locale={locale}
        allLabel={t('allLabel')}
        readArticleLabel={t('readArticle')}
        emptyLabel={t('empty')}
        moreLabel={t('more')}
      />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/dom-no-dangerously-set-innerhtml
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
};

export default BlogPage;
