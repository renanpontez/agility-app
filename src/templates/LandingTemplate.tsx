import React, { Suspense } from 'react';

import { BrandLoading } from '@/components/Loading';

const Header = React.lazy(() => import('@/components/Header'));
const Footer = React.lazy(() => import('@/components/Footer'));

const LandingTemplate = (props: {
  children: React.ReactNode;
}) => {
  // const t = useTranslations('LandingTemplate');
  // app/layout.tsx or app/page.tsx
  return (
    <div className="relative bg-secondaryDarker">
      <Suspense fallback={<BrandLoading size="fullscreen" />}>
        <Header style="transparent" />
        {props.children}
        <Footer />
      </Suspense>
    </div>
  );
};

export default LandingTemplate;
