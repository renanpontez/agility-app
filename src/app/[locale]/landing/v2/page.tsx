'use client';

import React from 'react';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Text from '@/components/Text';

const HeaderTitle: React.ReactNode = (
  <Text as="h1" styleOverride="h1" className="font-light leading-normal tracking-wide">
    TRANSFORMANDO IDEIAS EM
    <br />
    <Text as="h1" className="leading-normal tracking-wide">SOLUÇÕES QUE INSPIRAM</Text>
  </Text>
);

const LandingPage: React.FC = () => {
  // detect scroll
  const [isScrolled, setIsScrolled] = React.useState(false);
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <>
      {/* <Head>

      </Head> */}
      <div className="relative bg-secondaryDarker">
        <Header style="transparent" isScrolled={isScrolled} />
        <Hero
          mediaType="video"
          mediaSrc="https://cdn2.hubspot.net/hubfs/6436815/home-video.mp4"
          style="full-height"
          videoProps={{ autoPlay: true, loop: true, muted: true }}
          title={HeaderTitle}
        />

        <div style={{ minHeight: 2000 }}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        </div>
      </div>
    </>
  );
};

export default LandingPage;
