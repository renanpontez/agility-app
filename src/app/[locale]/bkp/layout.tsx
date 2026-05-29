import { setRequestLocale } from 'next-intl/server';

import LandingTemplate from '@/templates/LandingTemplate';

export default async function Layout(
  props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  },
) {
  setRequestLocale((await props.params).locale);
  return (
    <LandingTemplate>
      <div>{props.children}</div>
    </LandingTemplate>
  );
}
