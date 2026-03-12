import React, { Suspense } from 'react';

import AboutUs from '@/components/AboutUs';
import Button from '@/components/Button';
import Hero from '@/components/Hero';
import HorizontalBanner from '@/components/HorizontalBanner';
import { BrandLoading } from '@/components/Loading';
import Parallax from '@/components/Parallax/Parallax';
import ResultsSection from '@/components/ResultsSection';
import ServicesList from '@/components/ServicesList';
import Text from '@/components/Text';
import portfolioData from '@/data/portfolio.json';

const ContactForm = React.lazy(() => import('@/components/ContactForm'));
const Portfolio = React.lazy(() => import('@/components/Portfolio'));

export const metadata = {
  robots: { index: false, follow: false },
};

const OldLandingPage: React.FC = () => {
  return (
    <>
      <Hero
        mediaType="particles"
        style="full-height"
        applyMask
        maskClassName=""
        content={(
          <div className="flex max-w-xl flex-col items-start gap-6 md:gap-8">
            <Text
              as="h1"
              styleOverride="h1"
              className="text-3xl font-normal leading-tight tracking-wide text-white sm:text-4xl"
            >
              TRANSFORMANDO IDEIAS EM
              {' '}
              <br />
              SOLUÇÕES QUE INSPIRAM
            </Text>
            <Button style="outlined-light" size="sm" href="#Contato" target="_self">
              Agendar uma ligação
            </Button>
          </div>
        )}
      />

      <div className="flex flex-col gap-10">
        <section className="container pb-24">
          <AboutUs />
        </section>

        <section className="container pb-24">
          <ResultsSection />
        </section>

        <section className="container pb-24">
          <ServicesList />
        </section>

        <section>
          <HorizontalBanner />
        </section>

        <section className="mx-auto max-w-[90%] py-16 text-center md:max-w-[50%] md:py-24" id="Portfolio">
          <Text as="h3" styleOverride="h2" className="mb-4">
            Projetos que fizeram a
            {' '}
            <br />
            diferença na nossa história
          </Text>
          <Text as="p" className="text-white">
            Conheça mais sobre nossos serviços
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

export default OldLandingPage;
