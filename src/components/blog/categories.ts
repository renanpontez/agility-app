import type { BlogPost } from '@/types/blog';

export type BlogCategoryRef = {
  slug: string;
  label: string;
};

// Unicode "Nonspacing Mark" category — the combining diacritics produced by NFD.
const DIACRITICS = /\p{Mn}/gu;

export const slugifyCategory = (label: string) =>
  label
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const getOrderedCategories = (posts: Pick<BlogPost, 'category'>[]): BlogCategoryRef[] => {
  const seen = new Set<string>();
  const ordered: BlogCategoryRef[] = [];
  for (const post of posts) {
    if (!post.category) {
      continue;
    }
    const slug = slugifyCategory(post.category);
    if (seen.has(slug)) {
      continue;
    }
    seen.add(slug);
    ordered.push({ slug, label: post.category });
  }
  return ordered;
};

export const findCategoryBySlug = (
  posts: Pick<BlogPost, 'category'>[],
  slug: string,
): BlogCategoryRef | undefined =>
  getOrderedCategories(posts).find(category => category.slug === slug);

export const getAllCategorySlugs = (posts: Pick<BlogPost, 'category'>[]): string[] =>
  getOrderedCategories(posts).map(category => category.slug);

export type BlogCategoryWithCount = BlogCategoryRef & { count: number };

export const getPopularCategories = (
  posts: Pick<BlogPost, 'category'>[],
  limit: number,
): BlogCategoryWithCount[] => {
  const counts = new Map<string, BlogCategoryWithCount>();
  for (const post of posts) {
    if (!post.category) {
      continue;
    }
    const slug = slugifyCategory(post.category);
    const existing = counts.get(slug);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(slug, { slug, label: post.category, count: 1 });
    }
  }
  return [...counts.values()]
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);
};
