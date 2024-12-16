import Image from 'next/image';
import { Suspense } from 'react';

import BreadCrumb from '@/components/Atoms/BreadCrumb';
import type { BreadcrumbItemsProps } from '@/components/Atoms/BreadCrumb/BreadCrumb';
import PortfolioHeroContent from '@/components/Atoms/PortfolioHeroContent/PortfolioHeroContent';
import Button from '@/components/Button';
import ContactForm from '@/components/ContactForm';
import Hero from '@/components/Hero';
import { BrandLoading } from '@/components/Loading';
import Text from '@/components/Text';
import portfolioData from '@/data/portfolio.json';
import HostingAndDom from '@/public/assets/images/tags/hosting-and-dominio.png';
import SiteAndLP from '@/public/assets/images/tags/sites-and-lp.png';
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
  const breadcrumbItems: BreadcrumbItemsProps[] = [
    { name: 'home', href: '/',
    },
    { name: 'portfolio', href: '/portfolio' },
    { name: params.slug,
    },
  ];

  if (!selectedProject) {
    return <p>Projeto não encontrado</p>;
  }

  return (
    <>
      <section>
        <Hero
          mediaType="image"
          mediaClass="rounded-b-xxl md:rounded-b-xxxl"
          mediaSrc="/assets/images/desk_working.png"
          style="custom-height"
          applyMask
          maskClassName="rounded-b-xxl md:rounded-b-xxxl"
          content={(
            <PortfolioHeroContent
              projectName={selectedProject.name}
              tags={[SiteAndLP, HostingAndDom]}
            />
          )}
          className=" min-h-[300px] md:h-[60vh]"
        />
      </section>
      <BreadCrumb items={breadcrumbItems} />
      <div className="container my-16 text-white md:mb-20 md:mt-28">

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
          <Text as="h5" className="col-span-5 h-max font-semibold md:sticky md:top-24">
            SITE ENTREGUE
          </Text>
          <Image src={selectedProject.projectImage1} alt="image1" width={701} height={1590} className="col-span-6"></Image>
        </section>

        {/*  ESPAÇADOR */}
        <div className="mx-auto my-20 h-[0.5px] w-[70vw] rounded-full bg-white opacity-10 blur-[0.5xp]  md:w-160"></div>
        {/*  ESPAÇADOR */}

        <section className="relative flex flex-col flex-wrap gap-8 lg:grid lg:grid-cols-11">
          <div className="col-span-5 flex flex-wrap justify-center gap-10 md:flex-nowrap lg:justify-start">
            <Image src={selectedProject.projectImage2} alt="image2" width={178} height={400} className="lg:pt-10"></Image>
            <Image src={selectedProject.projectImage3} alt="image3" width={178} height={400} className="lg:pb-10"></Image>
          </div>
          <div className="col-span-6 ">
            <Text as="h5" className="mb-3 font-bold leading-snug tracking-wide"> DESENVOLVIMENTO</Text>
            <Text as="p" size="md" className="tracking-wider">{selectedProject.developmentDescription}</Text>
            <div className="mt-6 flex flex-wrap justify-around gap-x-3 gap-y-4 text-center sm:mt-14 md:justify-between">
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
            <Image src={selectedProject.projectImage4} alt="image4" width={600} height={312}></Image>
          </div>

        </section>

      </div>
      <section className="w-full  text-center md:pt-8 ">
        <Hero
          applyMask
          mediaType="image"
          mediaSrc="/assets/images/tablet_working.png"
          style="auto-height"
          altText="An amazing hero image"
          content={(
            <div className="mx-auto flex max-w-full flex-col items-center gap-5 py-24 text-center md:max-w-[70%]">
              <Text as="h4" styleOverride="h2">
                MENTES CRIATIVAS E PROCESSOS ORGANIZADOS GERAM MAIS
                {' '}
                <span className="text-primaryLighter">RESULTADOS</span>
              </Text>
              <Button style="outlined-light" size="sm">
                CONHEÇA A AGILITY
              </Button>
            </div>
          )}
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
