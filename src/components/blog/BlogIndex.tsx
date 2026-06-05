import type { BlogCardItem } from './BlogCard';
import BlogCard from './BlogCard';
import BlogCategoryTabs, { ALL_SLUG } from './BlogCategoryTabs';
import BlogFeaturedCard from './BlogFeaturedCard';
import type { BlogCategoryRef } from './categories';

type BlogIndexProps = {
  items: BlogCardItem[];
  categories: BlogCategoryRef[];
  activeSlug?: string;
  locale: string;
  allLabel: string;
  readArticleLabel: string;
  emptyLabel: string;
  moreLabel?: string;
};

const BlogIndex = ({
  items,
  categories,
  activeSlug = ALL_SLUG,
  locale,
  allLabel,
  readArticleLabel,
  emptyLabel,
  moreLabel,
}: BlogIndexProps) => {
  const [featured, ...rest] = items;

  return (
    <section className="mx-auto max-w-6xl px-5 pb-28 pt-2 sm:px-8 md:pb-36 md:pt-4">
      <BlogCategoryTabs
        categories={categories}
        activeSlug={activeSlug}
        allLabel={allLabel}
      />

      {!featured && (
        <p className="mt-16 rounded-2xl border border-dashed border-stone-200 bg-white/40 px-6 py-20 text-center text-sm text-stone-500">
          {emptyLabel}
        </p>
      )}

      {featured && (
        <div className="mt-10 md:mt-12">
          <BlogFeaturedCard
            item={featured}
            locale={locale}
            readArticleLabel={readArticleLabel}
          />
        </div>
      )}

      {rest.length > 0 && (
        <div className="mt-16 md:mt-20">
          {moreLabel && (
            <div className="mb-8 flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-stone-300" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                {moreLabel}
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map(item => (
              <BlogCard key={item.slug} item={item} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogIndex;
