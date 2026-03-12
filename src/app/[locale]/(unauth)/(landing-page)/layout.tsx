import { unstable_setRequestLocale } from 'next-intl/server';

import LandingV2Template from '@/templates/LandingV2Template';

export default function Layout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(props.params.locale);
  return (
    <LandingV2Template>
      {props.children}
    </LandingV2Template>
  );
}
