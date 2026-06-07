import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import type { BlogCardItem } from '@/components/blog';
import { BlogHero, BlogIndex, getOrderedCategories, SubscribeForm } from '@/components/blog';
import { getPostsSafe } from '@/libs/blogStore';
import { isPublished } from '@/types/blog';
import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';
import { buildDefaultLocaleAlternates, localizedUrl, ogLocale } from '@/utils/seo';

export const dynamic = 'force-dynamic';

const BLOG_PATH = '/blog';

export async function generateMetadata(): Promise<Metadata> {
  // Blog is pt-BR only by editorial decision — pin metadata to the default
  // locale even if `[locale]` happens to be `en` (middleware redirects /en/blog
  // → /blog, but generateMetadata can still be called once before the redirect
  // is followed).
  const t = await getTranslations({ locale: AppConfig.defaultLocale, namespace: 'BlogPage' });
  const alternates = buildDefaultLocaleAlternates(BLOG_PATH, { withRssFeed: true });
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
      locale: ogLocale(AppConfig.defaultLocale),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: t('subtitle'),
    },
  };
}

const BlogPage = async () => {
  // Blog locale is pinned to pt-BR (editorial decision). Middleware redirects
  // /en/blog → /blog before this page renders, so `[locale]` is always pt-BR
  // in practice — but pin it explicitly so the page is self-consistent even
  // if middleware is bypassed.
  const safeLocale = AppConfig.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: 'BlogPage' });

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
        locale={safeLocale}
        allLabel={t('allLabel')}
        readArticleLabel={t('readArticle')}
        emptyLabel={t('empty')}
        moreLabel={t('more')}
      />

      <div className="px-5 sm:px-8">
        <SubscribeForm source="blog-index" />
      </div>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/dom-no-dangerously-set-innerhtml
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
};

export default BlogPage;
