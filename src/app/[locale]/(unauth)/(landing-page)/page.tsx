import Head from 'next/head';
import React, { Suspense } from 'react';

import Button from '@/components/Button';
import Hero from '@/components/Hero';
import { BrandLoading } from '@/components/Loading';
import Logo from '@/components/Logo';
import Parallax from '@/components/Parallax/Parallax';
import RoundedBarItems from '@/components/RoundedBarItems';
import ServicesList from '@/components/ServicesList';
import Testimonials from '@/components/Testimonials/Testimonials';
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

        <section className="mx-auto max-w-[90%] py-16 text-center md:max-w-[50%] md:py-24" id="Portfolio">
          <Text as="h4" styleOverride="h1">
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

        <section>
          <Parallax
            applyMask
            maskClassName="bg-gradient-to-l"
            mediaSrc="/assets/images/desk_working.png"
          >
            <div className="flex w-full flex-col items-start gap-10 py-20 pr-12 text-left md:w-[30%]">
              <Logo symbolColor="primary" />
              {/* <div className="-mb-4 -ml-6">
                    <BrandLoading size="xlg" />
                  </div> */}
              <Text as="h3" styleOverride="p" size="lg">
                Nós acreditamos que organizando o
                {' '}
                <b>processo criativo</b>
                {' '}
                e trabalhando em
                {' '}
                <b>parceria com o cliente</b>
              </Text>
              <Text as="h3" styleOverride="p" size="lg">
                Conseguimos
                {' '}
                <b>maximizar os resultados</b>
                {' '}
                do seu projeto de maneira
                {' '}
                <span className="text-primaryLighter">ágil e confiável</span>
              </Text>

              <Button style="outlined-light" size="sm">
                NOSSOS PROJETOS
              </Button>
            </div>
          </Parallax>
        </section>

        <section className="mx-auto w-fit max-w-[70%] justify-center py-16 text-center md:max-w-[30%] md:py-32">
          <Testimonials />
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
