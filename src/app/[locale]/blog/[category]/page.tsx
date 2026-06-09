import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import type { BlogCardItem } from '@/components/blog';
import {
  blogArticlePath,
  blogCategoryPath,
  BlogHero,
  BlogIndex,
  findCategoryBySlug,
  getPopularCategories,
  slugifyCategory,
} from '@/components/blog';
import { getPostsSafe } from '@/libs/blogStore';
import { isPublished } from '@/types/blog';
import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';
import { buildDefaultLocaleAlternates, localizedUrl, ogLocale } from '@/utils/seo';

export const dynamic = 'force-dynamic';

type Params = {
  category: string;
  locale: string;
};

// `/blog/[category]` is a dual-purpose route:
//
// 1. If the segment matches a real CATEGORY → render the category page
//    (this is the canonical URL — was previously `/blog/category/<slug>`).
//
// 2. If it matches an old ARTICLE slug → 308 permanent-redirect to
//    `/blog/<category>/<slug>` (the new canonical article URL).
//    Catches every old indexed/shared URL and consolidates SEO equity.
//
// 3. Otherwise → 404.
//
// Static `/blog/categories/page.tsx` takes precedence at the same depth, so
// the categories hub is unaffected.

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category: categorySegment } = await props.params;
  const safeLocale = AppConfig.defaultLocale;
  const posts = await getPostsSafe();
  const category = findCategoryBySlug(posts, categorySegment);
  const t = await getTranslations({ locale: safeLocale, namespace: 'BlogCategory' });
  const alternates = buildDefaultLocaleAlternates(
    blogCategoryPath(categorySegment),
    { withRssFeed: true },
  );

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

const BlogCategoryOrLegacyArticlePage = async (props: { params: Promise<Params> }) => {
  const { category: categorySegment } = await props.params;
  const safeLocale = AppConfig.defaultLocale;
  const posts = await getPostsSafe();

  // Branch 2: legacy article URL — permanent-redirect to canonical.
  const matchingPost = posts.find(post => post.slug === categorySegment);
  if (matchingPost) {
    permanentRedirect(blogArticlePath(matchingPost));
  }

  // Branch 1: category page.
  const category = findCategoryBySlug(posts, categorySegment);
  if (!category) {
    notFound();
  }

  const tBlog = await getTranslations({ locale: safeLocale, namespace: 'BlogPage' });
  const tCategory = await getTranslations({ locale: safeLocale, namespace: 'BlogCategory' });

  const sortedPosts = posts
    .filter(post =>
      isPublished(post)
      && post.category
      && slugifyCategory(post.category) === categorySegment,
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
    author: post.author,
  }));

  const popularCategories = getPopularCategories(posts.filter(isPublished), 6);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `${tCategory('titlePrefix')} ${category.label}`,
    'description': tCategory('metaDescription', { category: category.label }),
    'url': localizedUrl(safeLocale, blogCategoryPath(categorySegment)),
    'inLanguage': safeLocale,
    'mainEntity': {
      '@type': 'ItemList',
      'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'url': localizedUrl(safeLocale, blogArticlePath(item)),
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
        popularCategories={popularCategories}
        locale={safeLocale}
        readArticleLabel={tBlog('readArticle')}
        emptyLabel={tBlog('empty')}
        featuredLabel={tBlog('featured')}
        latestLabel={tBlog('latest')}
        popularCategoriesLabel={tBlog('popularCategories')}
        loadMoreLabel={tBlog('loadMore')}
      />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/dom-no-dangerously-set-innerhtml
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
};

export default BlogCategoryOrLegacyArticlePage;
