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
};

const BlogIndex = ({
  items,
  categories,
  activeSlug = ALL_SLUG,
  locale,
  allLabel,
  readArticleLabel,
  emptyLabel,
}: BlogIndexProps) => {
  const [featured, ...rest] = items;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 pt-4 sm:px-6 md:pb-32 md:pt-6">
      <BlogCategoryTabs
        categories={categories}
        activeSlug={activeSlug}
        allLabel={allLabel}
      />

      {!featured && (
        <p className="mt-12 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-16 text-center text-sm text-neutral-500">
          {emptyLabel}
        </p>
      )}

      {featured && (
        <div className="mt-8 md:mt-10">
          <BlogFeaturedCard
            item={featured}
            locale={locale}
            readArticleLabel={readArticleLabel}
          />
        </div>
      )}

      {rest.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-5 md:mt-10 md:grid-cols-2 lg:grid-cols-3">
          {rest.map(item => (
            <BlogCard key={item.slug} item={item} locale={locale} />
          ))}
        </div>
      )}
    </section>
  );
};

export default BlogIndex;
