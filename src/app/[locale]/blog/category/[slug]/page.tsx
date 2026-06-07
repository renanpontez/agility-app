import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import type { BlogCardItem } from '@/components/blog';
import {
  BlogHero,
  BlogIndex,
  findCategoryBySlug,
  getOrderedCategories,
  slugifyCategory,
} from '@/components/blog';
import { getPostsSafe } from '@/libs/blogStore';
import { isPublished } from '@/types/blog';
import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';
import { buildDefaultLocaleAlternates, localizedUrl, ogLocale } from '@/utils/seo';

export const dynamic = 'force-dynamic';

type Params = {
  slug: string;
  locale: string;
};

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const safeLocale = AppConfig.defaultLocale;
  const posts = await getPostsSafe();
  const category = findCategoryBySlug(posts, slug);
  const t = await getTranslations({ locale: safeLocale, namespace: 'BlogCategory' });
  const alternates = buildDefaultLocaleAlternates(`/blog/category/${slug}`, { withRssFeed: true });

  if (!category) {
    return {
      metadataBase: new URL(getBaseUrl()),
      title: t('notFound'),
      alternates,
      robots: { index: false, follow: false },
    };
  }

  const title = `${t('titlePrefix')} ${category.label}`.trim();
  const description = t('metaDescription', { category: category.label });

  return {
    metadataBase: new URL(getBaseUrl()),
    title,
    description,
    keywords: [category.label, 'blog', 'agility creative'],
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: AppConfig.name,
      locale: ogLocale(safeLocale),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

const BlogCategoryPage = async (props: { params: Promise<Params> }) => {
  const { slug } = await props.params;
  // Blog is pt-BR only — pin locale regardless of `[locale]` segment.
  const safeLocale = AppConfig.defaultLocale;
  const posts = await getPostsSafe();
  const category = findCategoryBySlug(posts, slug);

  if (!category) {
    notFound();
  }

  const tBlog = await getTranslations({ locale: safeLocale, namespace: 'BlogPage' });
  const tCategory = await getTranslations({ locale: safeLocale, namespace: 'BlogCategory' });

  const sortedPosts = posts
    .filter(post =>
      isPublished(post)
      && post.category
      && slugifyCategory(post.category) === slug,
    )
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

  const categories = getOrderedCategories(posts.filter(isPublished));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `${tCategory('titlePrefix')} ${category.label}`,
    'description': tCategory('metaDescription', { category: category.label }),
    'url': localizedUrl(safeLocale, `/blog/category/${slug}`),
    'inLanguage': safeLocale,
    'mainEntity': {
      '@type': 'ItemList',
      'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'url': localizedUrl(safeLocale, `/blog/${item.slug}`),
        'name': item.title,
      })),
    },
  };

  return (
    <>
      <BlogHero
        eyebrow={`${tCategory('eyebrowPrefix')} · ${category.label}`}
        title={(
          <>
            {tCategory('titlePrefix')}
            {' '}
            <span className="text-primary">{category.label}</span>
          </>
        )}
        subtitle={tCategory('subtitle', { category: category.label })}
        breadcrumbs={[
          { label: tCategory('breadcrumbBlog'), href: '/blog' },
          { label: category.label },
        ]}
      />

      <BlogIndex
        items={items}
        categories={categories}
        activeSlug={slug}
        locale={safeLocale}
        allLabel={tBlog('allLabel')}
        readArticleLabel={tBlog('readArticle')}
        emptyLabel={tBlog('empty')}
        moreLabel={tBlog('more')}
      />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/dom-no-dangerously-set-innerhtml
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
};

export default BlogCategoryPage;
