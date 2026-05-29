import { setRequestLocale } from 'next-intl/server';

import LandingV2Template from '@/templates/LandingV2Template';

export default async function Layout(
  props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  },
) {
  setRequestLocale((await props.params).locale);
  return (
    <LandingV2Template>
      {props.children}
    </LandingV2Template>
  );
}
