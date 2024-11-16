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
              <Text as="h1" styleOverride="h1" className="xs:text-sm text-center text-5xl font-light !leading-snug tracking-wider text-white lg:text-left">
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
      <div className="container mt-32 text-white">

        <section className="grid grid-cols-11">
          <Text as="h2" className="col-span-5 text-lg font-semibold">
            INTRODUÇÃO
          </Text>
          <div className="col-span-6">
            <Text as="h3" className="mb-5 text-3xl font-medium">
              {selectedProject.introTitle}
            </Text>
            {selectedProject.introDescription.map((text, index) => <p className="mb-3 tracking-wider" key={index}>{text}</p>)}
          </div>
        </section>

        {/*  ESPAÇADOR */}
        <div className="mx-auto my-16 h-[0.5px] w-[70vw] rounded-full bg-white opacity-10 blur-[0.5xp]  md:w-160"></div>
        {/*  ESPAÇADOR */}

        <section className="grid grid-cols-11">
          <Text as="h2" className="sticky top-20 col-span-5 h-max text-lg font-semibold">
            SITE ENTREGUE
          </Text>
          <Image src="/assets/images/portfolio/mr-advogados/image1.png" alt="mr-adv-image1" width={701} height={1590} className="col-span-6"></Image>
        </section>

        {/*  ESPAÇADOR */}
        <div className="mx-auto my-16 h-[0.5px] w-[70vw] rounded-full bg-white opacity-10 blur-[0.5xp]  md:w-160"></div>
        {/*  ESPAÇADOR */}

        <section className="relative grid grid-cols-11">
          <div className="col-span-5 flex justify-start gap-10">
            <Image src="/assets/images/portfolio/mr-advogados/image2.png" alt="mr-adv-image2" width={178} height={400} className="pt-10"></Image>
            <Image src="/assets/images/portfolio/mr-advogados/image3.png" alt="mr-adv-image3" width={178} height={400} className="pb-10"></Image>
          </div>
          <div className="col-span-6 ">
            <Text as="h2" className="mb-3 text-lg font-bold tracking-wide"> DESENVOLVIMENTO</Text>
            {selectedProject.developmentDescription}
            <div className="mt-14 flex justify-between text-center">
              {selectedProject.metricAndValue.map((item, index) => (
                <div key={index}>
                  <Text as="p" className="text-5xl font-bold text-primary">
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
        <div className="mx-auto my-16 h-[0.5px] w-[70vw] rounded-full bg-white opacity-10 blur-[0.5xp]  md:w-160"></div>
        {/*  ESPAÇADOR */}

        <section>
          <Text as="h2" className="sticky top-0 col-span-5 mb-4 text-lg font-semibold">
            QUALIDADE E ENTREGA
          </Text>
          <Text as="p" className="mb-8 max-w-[43%] text-base">
            {selectedProject.qualityAndDeliveryDescription}
          </Text>
          <div className="relative grid grid-cols-2 tracking-wider">
            <div className="flex flex-col items-start justify-between">
              {selectedProject.descriptions.map((description, index) => (
                <div key={index} className="flex items-start gap-3">
                  {' '}
                  <Image src="/assets/images/icons/check.svg" alt="check-icon" width={22} height={22} className="opacity-20"></Image>
                  {description}
                </div>
              ))}
            </div>
            <Image src="/assets/images/portfolio/mr-advogados/image4.png" alt="mr-adv-image1" width={600} height={312}></Image>
          </div>

        </section>

        {/*  ESPAÇADOR */}
        <div className="mx-auto my-16 h-[0.5px] w-[70vw] rounded-full bg-white opacity-10 blur-[0.5xp]  md:w-160"></div>
        {/*  ESPAÇADOR */}
      </div>
      <section>
        <Hero
          mediaType="image"
          mediaSrc="/assets/images/tablet_working.png"
          style="custom-height"
          content={(
            <div className="mx-auto flex flex-col items-center text-center">
              <Text as="h1" styleOverride="h1" className="mx-auto text-3xl font-normal leading-loose tracking-normal text-white ">
                MENTES
                {' '}
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
