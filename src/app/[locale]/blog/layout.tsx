import { setRequestLocale } from 'next-intl/server';

import BlogTemplate from '@/templates/BlogTemplate';

export default async function Layout(
  props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  },
) {
  setRequestLocale((await props.params).locale);
  return (
    <BlogTemplate>
      {props.children}
    </BlogTemplate>
  );
}
