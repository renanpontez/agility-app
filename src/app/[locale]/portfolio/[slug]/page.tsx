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
              <Text as="h1" styleOverride="h1" className="xs:text-sm text-center text-4xl font-light leading-loose tracking-wider text-white lg:text-left">
                Veja como foi a
                {' '}
                <br />
                construção do site
                {' '}
                <br />
                da
                {' '}
                <span className="font-semibold">
                  {selectedProject.name.toUpperCase()}
                </span>
                <br />
                <span className="font-bold tracking-wider">SOLUÇÕES QUE INSPIRAM</span>
              </Text>
            </div>
          )}
          className="h-[300px] md:h-[60vh]"
        />
      </section>
      <div className="container text-white">

        <section className="grid grid-cols-11">
          <Text as="h2" className="col-span-5 text-lg font-semibold">
            INTRODUÇÃO
          </Text>
          <div className="col-span-6">
            <Text as="h3" className="mb-5 text-3xl font-medium">
              {selectedProject.introTitle}
            </Text>
            {selectedProject.introDescription.map((text, index) => <p className="mb-3" key={index}>{text}</p>)}
          </div>
        </section>

        {/*  ESPAÇADOR */}
        <span className="my-16 h-1 w-160 bg-white"></span>
        {/*  ESPAÇADOR */}

        <section className="relative grid grid-cols-11">
          <Text as="h2" className="sticky top-0 col-span-5 text-lg font-semibold">
            SITE ENTREGUE
          </Text>
          <Image src="/assets/images/portfolio/mr-advogados/image1.png" alt="mr-adv-image1" width={701} height={1590} className="col-span-6"></Image>
        </section>

        {/*  ESPAÇADOR */}
        <span className="h-2 w-[70vw] bg-white py-16 opacity-15 blur-[0.5px] md:w-160"></span>
        {/*  ESPAÇADOR */}

        <section className="relative grid grid-cols-11">
          <div className="col-span-5 flex justify-start gap-6">
            <Image src="/assets/images/portfolio/mr-advogados/image2.png" alt="mr-adv-image2" width={178} height={400} className="pt-10"></Image>
            <Image src="/assets/images/portfolio/mr-advogados/image3.png" alt="mr-adv-image3" width={178} height={400}></Image>
          </div>
          <div className="col-span-6">
            <Text as="h2" className="text-lg font-bold"> DESENVOLVIMENTO</Text>
            {selectedProject.developmentDescription}
            <div className="flex justify-around">
              {selectedProject.metricAndValue.map((item, index) => (
                <div key={index}>
                  <Text as="p" className="text-4xl text-primary">
                    {item.value}
                  </Text>
                  <Text as="p">
                    {item.metric.toUpperCase()}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*  ESPAÇADOR */}
        <span className="my-16 h-[0.5px] w-[70vw] bg-white opacity-15 blur-[0.5px] md:w-160"></span>
        {/*  ESPAÇADOR */}

        <section>
          <Text as="h2" className="sticky top-0 col-span-5 text-lg font-semibold">
            QUALIDADE E ENTREGA
          </Text>
          <Text as="p">
            {' '}
            {selectedProject.qualityAndDeliveryDescription}
          </Text>
          <div className="relative grid grid-cols-11">
            <div className="col-span-5">
              {selectedProject.descriptions.map((description, index) => (
                <div key={index} className="flex gap-3">
                  {' '}
                  <Image src="/assets/images/icons/check.svg" alt="check-icon" width={18} height={18}></Image>
                  {description}
                </div>
              ))}
            </div>
            <Image src="/assets/images/portfolio/mr-advogados/image4.png" alt="mr-adv-image1" width={600} height={312} className="col-span-6"></Image>
          </div>

        </section>

        {/*  ESPAÇADOR */}
        <span className="my-16 h-[0.5px] w-[70vw] bg-white opacity-15 blur-[0.5px] md:w-160"></span>
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
              <Button style="outlined-light">CONHEÇA A AGILITY</Button>
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
