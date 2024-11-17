import Image from 'next/image';
import { Suspense } from 'react';

import Button from '@/components/Button';
import ContactForm from '@/components/ContactForm';
import Hero from '@/components/Hero';
import { BrandLoading } from '@/components/Loading';
import Text from '@/components/Text';
import portfolioData from '@/data/portfolio.json';
import type { Project } from '@/types/portfolio';

type Params = {
  slug: string;
};

export async function generateStaticParams() {
  return portfolioData.map((item: Project) => ({
    slug: item.slug,
  }));
}

const PortfolioPage = async ({ params }: { params: Params }) => {
  const selectedProject = portfolioData.find((item: Project) => item.slug === params.slug);

  if (!selectedProject) {
    return <p>Projeto não encontrado</p>;
  }

  return (
    <>
      <section>
        <Hero
          mediaType="image"
          mediaSrc="/assets/images/desk_working.png"
          style="custom-height"
          content={(
            <div className="mx-auto flex flex-col justify-center gap-10 md:justify-start lg:mx-0">
              <Text as="h1" styleOverride="h1" className=" text-center text-3xl font-normal !leading-snug tracking-wider text-white md:text-5xl md:font-light lg:text-left">
                Veja como foi a
                <br />
                construção do site
                <br />
                da
                {' '}
                <span className="font-semibold">
                  {selectedProject.name.toUpperCase()}
                </span>
              </Text>
            </div>
          )}
          className="h-[300px] md:h-[60vh]"
        />
      </section>
      <div className="container mt-16 text-white md:mt-32">

        <section className="flex flex-col gap-8 md:grid md:grid-cols-11">
          <Text as="h5" className="col-span-5 font-semibold">
            INTRODUÇÃO
          </Text>
          <div className="col-span-6">
            <Text as="h3" className="mb-5 text-3xl font-medium leading-snug">
              {selectedProject.introTitle}
            </Text>
            {selectedProject.introDescription.map((text, index) => <Text as="p" size="md" className="mt-3 tracking-wider" key={index}>{text}</Text>)}
          </div>
        </section>

        {/*  ESPAÇADOR */}
        <div className="mx-auto my-20 h-[0.5px] w-[70vw] rounded-full bg-white opacity-10 blur-[0.5xp]  md:w-160"></div>
        {/*  ESPAÇADOR */}

        <section className="flex flex-col gap-8 md:grid md:grid-cols-11">
          <Text as="h5" className="col-span-5 h-max font-semibold md:sticky md:top-20">
            SITE ENTREGUE
          </Text>
          <Image src="/assets/images/portfolio/mr-advogados/image1.png" alt="mr-adv-image1" width={701} height={1590} className="col-span-6"></Image>
        </section>

        {/*  ESPAÇADOR */}
        <div className="mx-auto my-20 h-[0.5px] w-[70vw] rounded-full bg-white opacity-10 blur-[0.5xp]  md:w-160"></div>
        {/*  ESPAÇADOR */}

        <section className="relative flex flex-col flex-wrap gap-8 lg:grid lg:grid-cols-11">
          <div className="col-span-5 flex flex-wrap justify-center gap-10 md:flex-nowrap lg:justify-start">
            <Image src="/assets/images/portfolio/mr-advogados/image2.png" alt="mr-adv-image2" width={178} height={400} className="pt-10"></Image>
            <Image src="/assets/images/portfolio/mr-advogados/image3.png" alt="mr-adv-image3" width={178} height={400} className="pb-10"></Image>
          </div>
          <div className="col-span-6 ">
            <Text as="h5" className="mb-3 font-bold leading-snug tracking-wide"> DESENVOLVIMENTO</Text>
            <Text as="p" size="md" className="tracking-wider">{selectedProject.developmentDescription}</Text>
            <div className="mt-6 flex flex-wrap justify-around text-center sm:mt-14 md:justify-between">
              {selectedProject.metricAndValue.map((item, index) => (
                <div key={index}>
                  <Text as="p" size="md" className="text-5xl font-bold text-primary">
                    {item.value}
                  </Text>
                  <Text as="p" className="pt-1">
                    {item.metric.toUpperCase()}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*  ESPAÇADOR */}
        <div className="mx-auto my-20 h-[0.5px] w-[70vw] rounded-full bg-white opacity-10 blur-[0.5xp]  md:w-160"></div>
        {/*  ESPAÇADOR */}

        <section>
          <Text as="h5" className="sticky top-0 col-span-5 mb-4 text-center font-semibold md:text-start">
            QUALIDADE E ENTREGA
          </Text>
          <Text as="p" size="md" className="mb-8 text-start lg:max-w-[44%]">
            {selectedProject.qualityAndDeliveryDescription}
          </Text>
          <div className="relative flex grid-cols-2 flex-col gap-8 tracking-wider md:grid">
            <div className="flex flex-col items-start justify-between">
              {selectedProject.descriptions.map((description, index) => (
                <div key={index} className="flex items-start gap-4">
                  <Image src="/assets/images/icons/check.svg" alt="check-icon" width={24} height={24} className="opacity-20"></Image>
                  <Text as="p" size="md" className="tracking-wide">{description}</Text>
                </div>
              ))}
            </div>
            <Image src="/assets/images/portfolio/mr-advogados/image4.png" alt="mr-adv-image1" width={600} height={312}></Image>
          </div>

        </section>

        {/*  ESPAÇADOR */}
        <div className="mx-auto my-20 h-[0.5px] w-[70vw] rounded-full bg-white opacity-10 blur-[0.5xp]  md:w-160"></div>
        {/*  ESPAÇADOR */}
      </div>
      <section>
        <Hero
          mediaType="image"
          mediaSrc="/assets/images/tablet_working.png"
          style="custom-height"
          content={(
            <div className="mx-auto flex flex-col items-center justify-center text-center">
              <Text as="h1" className="text-xl font-medium leading-loose tracking-normal text-white md:text-3xl md:font-normal">
                MENTES
                <strong className="font-medium">CRIATIVAS</strong>
                {' '}
                E
                {' '}
                <strong className="font-medium">PROCESSOS</strong>
                {' '}
                ORGANIZADOS
                <br />
                GERAM MAIS
                {' '}
                <span className="font-bold tracking-wider text-primary">RESULTADOS</span>
              </Text>
              <Button style="outlined-light" className="mt-6">CONHEÇA A AGILITY</Button>
            </div>
          )}
          className="h-[300px] md:h-[35vh]"
        />
      </section>
      <section className="flex w-full flex-col justify-between gap-16 md:flex-row" id="Contato">
        <Suspense fallback={<BrandLoading />}>
          <ContactForm />
        </Suspense>
      </section>
    </>
  );
};

export default PortfolioPage;
