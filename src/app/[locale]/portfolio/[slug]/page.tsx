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
          mediaClass="rounded-b-[60px]"
          mediaSrc="/assets/images/desk_working.png"
          style="custom-height"
          applyMask
          maskClassName="rounded-b-[60px]"
          content={(
            <div className="mx-auto flex flex-col justify-end gap-10 md:mt-32 md:justify-end md:gap-20 lg:mx-0">
              <Text as="h1" styleOverride="h1" className=" text-center text-xl font-normal !leading-snug tracking-wider text-white sm:text-3xl md:font-light lg:text-left lg:text-5xl">
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
              <div className="flex flex-wrap gap-2 md:gap-10">
                <Button
                  style="dark"
                  icon={(
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M4.05941 5.02041C3.87174 5.02041 3.69175 5.09512 3.55904 5.22812C3.42634 5.36112 3.35178 5.5415 3.35178 5.72958V12.8214C3.35178 13.0094 3.42634 13.1898 3.55904 13.3228C3.69175 13.4558 3.87174 13.5305 4.05941 13.5305H13.9662C14.1539 13.5305 14.3339 13.4558 14.4666 13.3228C14.5993 13.1898 14.6739 13.0094 14.6739 12.8214V5.72958C14.6739 5.5415 14.5993 5.36112 14.4666 5.22812C14.3339 5.09512 14.1539 5.02041 13.9662 5.02041H4.05941ZM2.5583 4.22519C2.95642 3.8262 3.49639 3.60205 4.05941 3.60205H13.9662C14.5293 3.60205 15.0692 3.8262 15.4673 4.22519C15.8655 4.62418 16.0891 5.16533 16.0891 5.72958V12.8214C16.0891 13.3856 15.8655 13.9268 15.4673 14.3257C15.0692 14.7247 14.5293 14.9489 13.9662 14.9489H4.05941C3.49639 14.9489 2.95642 14.7247 2.5583 14.3257C2.16018 13.9268 1.93652 13.3856 1.93652 12.8214V5.72958C1.93652 5.16533 2.16018 4.62418 2.5583 4.22519Z" fill="#BC01FD" />
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M4.05957 6.43867C4.05957 6.047 4.37639 5.72949 4.7672 5.72949H4.77428C5.16509 5.72949 5.48191 6.047 5.48191 6.43867C5.48191 6.83034 5.16509 7.14785 4.77428 7.14785H4.7672C4.37639 7.14785 4.05957 6.83034 4.05957 6.43867Z" fill="#BC01FD" />
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M6.18262 6.43867C6.18262 6.047 6.49943 5.72949 6.89025 5.72949H6.89732C7.28814 5.72949 7.60495 6.047 7.60495 6.43867C7.60495 6.83034 7.28814 7.14785 6.89732 7.14785H6.89025C6.49943 7.14785 6.18262 6.83034 6.18262 6.43867Z" fill="#BC01FD" />
                    </svg>
                  )}
                >
                  Sites e Landing pages
                </Button>
                <Button
                  style="dark"
                  icon={(
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_600_2510)">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.83651 5.17527C8.95304 4.83511 10.1782 5.06573 11.042 5.75936L7.83651 5.17527ZM11.9273 4.65236C10.684 3.65425 8.96962 3.34743 7.42407 3.81841L7.42384 3.81848C6.05531 4.23602 4.9608 5.22267 4.48999 6.49842C2.55107 6.75246 1.02246 8.35992 1.02246 10.3511C1.02246 12.5007 2.80277 14.2028 4.958 14.239C4.98103 14.2412 5.00439 14.2424 5.02802 14.2424H13.4385C15.1889 14.2424 16.6 12.8144 16.6 11.0603C16.6 9.33538 15.2344 7.92543 13.5242 7.88007C13.5238 6.64513 12.9424 5.46546 11.9273 4.65236ZM5.09178 12.824H13.4385C14.3986 12.824 15.1839 12.0394 15.1839 11.0603C15.1839 10.082 14.3986 9.2973 13.4392 9.2973H12.7382C12.5234 9.2973 12.3202 9.19964 12.1858 9.0318C12.0514 8.86397 12.0004 8.64411 12.047 8.43411C12.2619 7.46664 11.8999 6.44654 11.0427 5.7599L11.042 5.75936M5.09178 12.824C5.07078 12.8222 5.04951 12.8212 5.02802 12.8212C3.57225 12.8212 2.4386 11.6902 2.4386 10.3511C2.4386 9.01291 3.57215 7.88178 5.02802 7.88178C5.35968 7.88178 5.6469 7.6512 5.71911 7.32698C5.93601 6.35299 6.72187 5.51544 7.83628 5.17534" fill="#BC01FD" />
                      </g>
                      <defs>
                        <clipPath id="clip0_600_2510">
                          <rect width="16.9937" height="17.0203" fill="white" transform="translate(0.314453 0.765137)" />
                        </clipPath>
                      </defs>
                    </svg>
                  )}
                >
                  Hosting e Domínio
                </Button>
              </div>
            </div>
          )}
          className="h-[300px] md:h-[60vh]"
        />
      </section>
      <div className="container my-16 text-white md:mb-20 md:mt-32">

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
