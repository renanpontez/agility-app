import Head from 'next/head';
import React, { Suspense } from 'react';

import AboutUs from '@/components/AboutUs';
import Button from '@/components/Button';
import Hero from '@/components/Hero';
import HorizontalBanner from '@/components/HorizontalBanner';
import { BrandLoading } from '@/components/Loading';
import Parallax from '@/components/Parallax/Parallax';
import RoundedBarItems from '@/components/RoundedBarItems';
import ServicesList from '@/components/ServicesList';
import Text from '@/components/Text';
import portfolioData from '@/data/portfolio.json';
import { getBaseUrl } from '@/utils/Helpers';

const ContactForm = React.lazy(() => import('@/components/ContactForm'));
const Portfolio = React.lazy(() => import('@/components/Portfolio'));

const LandingPage: React.FC = () => {
  return (
    <>
      <Head>
        <meta http-equiv="refresh" content={`0; url=${getBaseUrl()}`} />
      </Head>

      <Hero
        mediaType="video"
        mediaSrc="https://cdn2.hubspot.net/hubfs/6436815/home-video.mp4"
        style="custom-height"
        videoProps={{
          autoPlay: true,
          loop: true,
          muted: true,
          poster: '/assets/images/video_cover.webp',
          controls: false,
        }}
        content={(
          <div className="mx-auto -mt-16 flex flex-col justify-center gap-10 md:justify-start lg:mx-0">
            {/* <Logo showSymbol={false} showName showSlogan nameSloganColor="white" className="mx-auto lg:invisible" size="sm" style="standard" /> */}
            <Text as="h1" styleOverride="h1" className="text-center text-lg font-light leading-normal tracking-wide text-white xs:text-sm lg:text-left">
              TRANSFORMANDO IDEIAS EM
              <br />
              <span className="font-bold tracking-wider">SOLUÇÕES QUE INSPIRAM</span>
            </Text>
          </div>
        )}
        className="h-[300px] md:h-[60vh]"
      />

      <div className="flex flex-col gap-10">

        <div className="relative mx-auto my-10 w-fit">
          <RoundedBarItems />
        </div>

        <section className="container pb-24">
          <ServicesList />
        </section>

        <section className="container pb-24">
          <AboutUs />
        </section>

        <section>
          <HorizontalBanner />
        </section>

        <section className="mx-auto max-w-[90%] py-16 text-center md:max-w-[50%] md:py-24" id="Portfolio">
          <Text as="h4" styleOverride="h2">
            PROJETOS QUE FIZERAM A
            {' '}
            <span className="text-primary">DIFERENÇA</span>
            {' '}
            NA NOSSA HISTÓRIA
          </Text>
          <Text as="em">
            Conheça os cases de sucesso que nos inspiram a cada dia.
          </Text>

          <div className="mt-10">
            <Suspense fallback={<BrandLoading />}>
              <Portfolio items={portfolioData} />
            </Suspense>
          </div>
        </section>

        <section className="w-full">
          <Parallax
            applyMask
            maskClassName="bg-gradient-to-l from-black/30 to-black/90"
            mediaSrc="/assets/images/agility-team-working.jpeg"
            height="h-[40vh]"
            intensity={300}
          >
            <div className="container flex h-full items-center">
              <div className="flex w-full flex-col items-start gap-10 py-20 pr-12 text-left md:w-3/5">

                <Text as="h3">
                  Mentes
                  {' '}
                  <b className="font-bold">criativas</b>
                  {' '}
                  e processos
                  {' '}
                  <b className="font-bold">organizados</b>
                  {' '}
                  geram mais resultados para qualquer projeto digital
                </Text>
                <Button style="outlined-light" size="sm" target="_self" href="#Contato">
                  CONHEÇA A AGILITY
                </Button>

              </div>
            </div>
          </Parallax>
        </section>

        <section className="container mb-32 flex w-full flex-col justify-between gap-16 md:my-24 md:mb-64 md:flex-row" id="Contato">
          <Suspense fallback={<BrandLoading />}>
            <ContactForm />
          </Suspense>
        </section>
      </div>

    </>
  );
};

export default LandingPage;
