'use client';

import { useState } from 'react';

import type { BlogCardItem } from './BlogCard';
import BlogCardHorizontal from './BlogCardHorizontal';
import BlogFeaturedCard from './BlogFeaturedCard';
import BlogSidebar from './BlogSidebar';
import type { BlogCategoryWithCount } from './categories';

const PAGE_SIZE = 12;

type BlogIndexProps = {
  items: BlogCardItem[];
  popularCategories: BlogCategoryWithCount[];
  locale: string;
  readArticleLabel: string;
  emptyLabel: string;
  featuredLabel: string;
  latestLabel: string;
  popularCategoriesLabel: string;
  loadMoreLabel: string;
};

const BlogIndex = ({
  items,
  popularCategories,
  locale,
  readArticleLabel,
  emptyLabel,
  featuredLabel,
  latestLabel,
  popularCategoriesLabel,
  loadMoreLabel,
}: BlogIndexProps) => {
  const [featured, ...rest] = items;
  const [page, setPage] = useState(1);

  const visibleItems = rest.slice(0, page * PAGE_SIZE);
  const hasMore = rest.length > visibleItems.length;

  return (
    <section className="mx-auto max-w-6xl px-5 pb-28 pt-2 sm:px-8 md:pb-36 md:pt-4">
      {!featured && (
        <p className="mt-8 rounded-2xl border border-dashed border-stone-200 bg-white/40 px-6 py-20 text-center text-sm text-stone-500">
          {emptyLabel}
        </p>
      )}

      {featured && (
        <BlogFeaturedCard
          item={featured}
          locale={locale}
          readArticleLabel={readArticleLabel}
          eyebrowLabel={featuredLabel}
        />
      )}

      {rest.length > 0 && (
        <>
          <hr aria-hidden className="my-14 border-stone-200/70 md:my-16" />
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr] lg:gap-16">
            <div>
              <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">
                {latestLabel}
              </p>
              <div className="flex flex-col">
                {visibleItems.map(item => (
                  <BlogCardHorizontal key={item.slug} item={item} locale={locale} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setPage(p => p + 1)}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-stone-200/70 bg-white px-6 text-[13px] font-medium tracking-tight text-stone-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:-translate-y-0.5 hover:border-stone-300 hover:text-stone-900 hover:shadow-[0_8px_20px_-12px_rgba(0,0,0,0.12)]"
                  >
                    {loadMoreLabel}
                    <span aria-hidden className="text-stone-400">↓</span>
                  </button>
                </div>
              )}
            </div>

            <BlogSidebar
              popularCategories={popularCategories}
              popularCategoriesLabel={popularCategoriesLabel}
            />
          </div>
        </>
      )}
    </section>
  );
};

export default BlogIndex;
