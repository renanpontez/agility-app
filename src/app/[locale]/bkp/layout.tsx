import { setRequestLocale } from 'next-intl/server';

import LandingTemplate from '@/templates/LandingTemplate';

export default function Layout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(props.params.locale);
  return (
    <LandingTemplate>
      <div>{props.children}</div>
    </LandingTemplate>
  );
}
