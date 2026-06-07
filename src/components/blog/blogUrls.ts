import { slugifyCategory } from './categories';

// Posts without a category are routed under a stable bucket so the URL
// shape stays consistent. The bot always sets a category, so this is a
// guard for hand-written edge cases.
export const UNCATEGORIZED_SLUG = 'sem-categoria';

const toCategorySlug = (category: string | undefined): string => {
  if (!category) {
    return UNCATEGORIZED_SLUG;
  }
  const slug = slugifyCategory(category);
  return slug || UNCATEGORIZED_SLUG;
};

/** `/blog/{category-slug}/{post-slug}` — the canonical article URL. */
export const blogArticlePath = (post: { slug: string; category?: string }): string =>
  `/blog/${toCategorySlug(post.category)}/${post.slug}`;

/** `/blog/{category-slug}` — the canonical category index URL. */
export const blogCategoryPath = (category: string | { slug: string } | undefined): string => {
  if (!category) {
    return `/blog/${UNCATEGORIZED_SLUG}`;
  }
  const slug = typeof category === 'string' ? toCategorySlug(category) : category.slug;
  return `/blog/${slug}`;
};

/** Blog index. */
export const blogIndexPath = (): string => '/blog';

/** Categories hub (all categories). */
export const blogCategoriesPath = (): string => '/blog/categories';

/** Resolve the category slug for a post (used by redirect logic on legacy URLs). */
export const postCategorySlug = (post: { category?: string }): string =>
  toCategorySlug(post.category);
