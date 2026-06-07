import { setRequestLocale } from 'next-intl/server';

import { getOrderedCategories } from '@/components/blog';
import { getPostsSafe } from '@/libs/blogStore';
import BlogTemplate from '@/templates/BlogTemplate';
import { isPublished } from '@/types/blog';

export default async function Layout(
  props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  },
) {
  setRequestLocale((await props.params).locale);
  // Categories feed the header dropdown. Fetching once at the layout level
  // keeps every blog page consistent without each page re-querying.
  const posts = await getPostsSafe();
  const categories = getOrderedCategories(posts.filter(isPublished));
  return (
    <BlogTemplate categories={categories}>
      {props.children}
    </BlogTemplate>
  );
}
