import React from 'react';

import Footer from '../components/Footer';
import Header from '../components/Header';

const LandingTemplate = (props: {
  children: React.ReactNode;
}) => {
  // const t = useTranslations('LandingTemplate');
  // app/layout.tsx or app/page.tsx
  return (
    <div className="relative bg-secondaryDarker">
      <Header style="transparent" />
      {props.children}
      <Footer />
    </div>
  );
};

export default LandingTemplate;
