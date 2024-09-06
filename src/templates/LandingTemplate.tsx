import React, { Suspense } from 'react';

import Header from '@/components/Header';
import { BrandLoading } from '@/components/Loading';

const Footer = React.lazy(() => import('@/components/Footer'));

const LandingTemplate = (props: {
  children: React.ReactNode;
}) => {
  // const t = useTranslations('LandingTemplate');
  // app/layout.tsx or app/page.tsx
  return (
    <div className="relative bg-secondaryDarker">
      <Header style="transparent" />
      {props.children}
      <Suspense fallback={<BrandLoading size="sm" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default LandingTemplate;
