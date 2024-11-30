import React, { Suspense } from 'react';

import { BrandLoading } from '@/components/Loading';

const CVTemplate = (props: {
  children: React.ReactNode;
}) => {
  return (
    <div className="relative bg-secondaryDarker">
      <Suspense fallback={<BrandLoading size="fullscreen" />}>
        {props.children}
      </Suspense>
    </div>
  );
};

export default CVTemplate;
