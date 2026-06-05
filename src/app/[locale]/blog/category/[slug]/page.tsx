import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import type { BlogCardItem } from '@/components/blog';
import {
  BlogHero,
  BlogIndex,
  findCategoryBySlug,
  getAllCategorySlugs,
  getOrderedCategories,
  slugifyCategory,
} from '@/components/blog';
import blogData from '@/data/blog.json';
import type { BlogPost } from '@/types/blog';
import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';
import { buildAlternates, localizedUrl, ogAlternateLocales, ogLocale } from '@/utils/seo';

type Params = {
  slug: string;
  locale: string;
};

const posts = blogData as BlogPost[];

export function generateStaticParams() {
  return getAllCategorySlugs(posts).map(slug => ({ slug }));
}

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, locale } = await props.params;
  const safeLocale = (AppConfig.locales as readonly string[]).includes(locale)
    ? (locale as (typeof AppConfig.locales)[number])
    : AppConfig.defaultLocale;
  const category = findCategoryBySlug(posts, slug);
  const t = await getTranslations({ locale: safeLocale, namespace: 'BlogCategory' });
  const alternates = buildAlternates(safeLocale, `/blog/category/${slug}`);

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
      alternateLocale: ogAlternateLocales(safeLocale),
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
  const { slug, locale } = await props.params;
  const safeLocale = (AppConfig.locales as readonly string[]).includes(locale)
    ? (locale as (typeof AppConfig.locales)[number])
    : AppConfig.defaultLocale;
  const category = findCategoryBySlug(posts, slug);

  if (!category) {
    notFound();
  }

  const tBlog = await getTranslations('BlogPage');
  const tCategory = await getTranslations('BlogCategory');

  const sortedPosts = [...posts]
    .filter(post => post.category && slugifyCategory(post.category) === slug)
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

  const categories = getOrderedCategories(posts);

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
        locale={locale}
        allLabel={tBlog('allLabel')}
        readArticleLabel={tBlog('readArticle')}
        emptyLabel={tBlog('empty')}
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
