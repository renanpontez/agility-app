import { permanentRedirect } from 'next/navigation';

import { blogCategoryPath } from '@/components/blog';

export const dynamic = 'force-dynamic';

type Params = { slug: string };

// Legacy shim. Category pages moved from `/blog/category/<slug>` to the
// shorter, dropdown-friendly `/blog/<slug>`. Any indexed or shared URL on
// the old path gets a permanent redirect so SEO equity follows.
//
// Generates a runtime metadata noop — there's no body to render, the
// permanent-redirect returns 308 before metadata matters.
export default async function BlogCategoryLegacyPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  permanentRedirect(blogCategoryPath(slug));
}
