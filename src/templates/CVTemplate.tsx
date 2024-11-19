import React, { Suspense } from 'react';

import { BrandLoading } from '@/components/Loading';

const Footer = React.lazy(() => import('@/components/Footer'));

const CVTemplate = (props: {
  children: React.ReactNode;
}) => {
  return (
    <div className="relative bg-secondaryDarker">
      <Suspense fallback={<BrandLoading size="fullscreen" />}>
        {props.children}
        <Footer />
      </Suspense>
    </div>
  );
};

export default CVTemplate;
