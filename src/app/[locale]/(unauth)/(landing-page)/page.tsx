import classNames from 'classnames';
import React from 'react';
import { FaChartColumn, FaComputer, FaEnvelopesBulk } from 'react-icons/fa6';

import Button from '@/components/Button';
import Card from '@/components/Card';
import ContactForm from '@/components/ContactForm';
import Hero from '@/components/Hero';
import Logo from '@/components/Logo';
import Portfolio from '@/components/Portfolio';
import Testimonials from '@/components/Testimonials/Testimonials';
import Text from '@/components/Text';
import { PORTFOLIO_ITEMS } from '@/utils/Constants';

const LandingPage: React.FC = () => {
  return (
    <>
      <Hero
        mediaType="video"
        mediaSrc="https://cdn2.hubspot.net/hubfs/6436815/home-video.mp4"
        style="custom-height"
        videoProps={{ autoPlay: true, loop: true, muted: true, poster: 'https://media.cleanshot.cloud/media/31388/419LxoWlUd6cNz0SXcYoiiMVSKjZR3BffGTVWHjK.jpeg?Expires=1725224290&Signature=WJQfDTU7kg7R6Y78mGl-ylDgJRjReocUGaMd~D9~xQpdHjcj4q8ztAz4oSLwhZeCy6Ki6IzFawTP1WQcpHKPkiD1u~lrBviIPNkffT6wz0tRKPJ0rMh3Pv-Jse53h4Nwf3zW5VdlsVewRx6RxKYyPyLT8NE3XyxWX6t5gdxLsx4m0MUM0Qc30kz1m-HY9SAl5klw96GTPodqrcFRMbleZ8TPRjmgB95OTsIRqBIn2tkWMIc0uTs5be-nCf3JM0sjoT7pBAy59zr6L2G-9MQxEcyzIh~yvIJ0GBFrNIKmQt1NTslbGE5GMMJmLJIB9OFC8vYzstpZuW7Qinakph4UiQ__&Key-Pair-Id=K269JMAT9ZF4GZ' }}
        content={(
          <div className="mx-auto -mt-16 flex flex-col justify-center gap-10 md:justify-start lg:mx-0">
            <Logo symbolColor="primary" className="mx-auto lg:invisible" size="sm" />
            <Text as="h1" styleOverride="h1" className="xs:text-sm text-center text-lg font-light leading-normal tracking-wide text-white lg:text-left">
              TRANSFORMANDO IDEIAS EM
              <br />
              <span className="font-bold tracking-wider">SOLUÇÕES QUE INSPIRAM</span>
            </Text>
          </div>
        )}
        className="h-[500px] md:h-[80vh]"
      />

      <div className="relative mx-auto -mt-16 w-fit">
        <Card className="mx-auto animate-pulseShadow bg-secondaryDarker">
          <div className={classNames(
            'flex flex-col items-center justify-between gap-16 px-10 py-4',
            'md:flex-row md:gap-32',
          )}
          >
            {
              [{
                title: '11',
                description: 'ANOS DE EXPERIÊNCIA',
              }, {
                title: '+50',
                description: 'PROJETOS CONCLUÍDOS',
              }, {
                title: '+90%',
                description: 'CLIENTES APROVAM',
              }, {
                title: '5',
                description: 'MENTES CRIATIVAS',
              }].map(item => (
                <div key={item.title} className="flex flex-col items-center justify-center gap-2">
                  <Text as="h5" styleOverride="h2" className="tracking-wider text-primary">{item.title}</Text>
                  <Text as="small" className="text-center text-secondaryLighter">{item.description}</Text>
                </div>
              ))
            }
          </div>
        </Card>
      </div>

      <section className="mx-auto w-fit max-w-[70%] justify-center py-16 text-center md:max-w-[30%] md:py-32">
        <Testimonials />
      </section>

      <section>
        <Hero
          applyMask
          maskClassName="bg-gradient-to-l"
          mediaType="image"
          mediaSrc="/assets/images/desk_working.png"
          style="auto-height"
          altText="A desk containing a laptop, a notebook, and a cup of coffee"

          content={(
            <div className="flex w-full flex-col items-start gap-10 py-20 pr-12 text-left md:w-[30%]">
              <Logo symbolColor="primary" />
              {/* <div className="-mb-4 -ml-6">
                  <BrandLoading size="xlg" />
                </div> */}
              <Text as="p" size="lg">
                Nós acreditamos que organizando o
                {' '}
                <b>processo criativo</b>
                {' '}
                e trabalhando em
                {' '}
                <b>parceria com o cliente</b>
              </Text>
              <Text as="p" size="lg">
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
          )}
        />
      </section>

      <section className="mx-auto max-w-[90%] py-16 text-center md:max-w-[50%] md:py-24" id="Portfolio">
        <Text as="h2" styleOverride="h1">
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
          <Portfolio items={PORTFOLIO_ITEMS} />
        </div>
      </section>

      <section className="w-full py-16 text-center md:py-24">
        <Hero
          applyMask
          mediaType="image"
          mediaSrc="/assets/images/tablet_working.png"
          style="auto-height"
          altText="An amazing hero image"
          content={(
            <div className="mx-auto flex max-w-full flex-col items-center gap-5 py-24 text-center md:max-w-[35%]">
              <Text as="h2">
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

      <section className="container pb-24">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          {[{
            icon: FaComputer,
            title: 'Design único e tecnologia sempre atual',
            description: 'Criamos experiências digitais memoráveis combinando design inovador com a tecnologia mais adequada. Seu projeto será único e eficiente.',
          }, {
            icon: FaEnvelopesBulk,
            title: 'Comunicação transparente e constante',
            description: 'Valorizamos a transparência e mantemos uma comunicação constante. Esteja sempre atualizado sobre o progresso do seu projeto.',
          }, {
            icon: FaChartColumn,
            title: 'Qualidade e suporte',
            description: 'Comprometidos com a excelência, garantimos a qualidade em cada etapa. Além disso, oferecemos suporte contínuo para garantir o sucesso contínuo do seu projeto.',
          }].map(item => (
            <Card key={item.title} className="flex w-full flex-col items-center justify-center gap-5 bg-secondaryDark p-10 text-center md:w-[33%]" shadow="lg">
              <div className="flex items-center justify-center">
                <item.icon className="text-primaryLighter" size={36} />
              </div>
              <div className="flex flex-col gap-3">
                <Text as="h5">{item.title}</Text>
                <Text as="p">{item.description}</Text>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="container my-8 flex w-full flex-col justify-between gap-16 md:my-24 md:flex-row" id="Contato">
        <ContactForm />
      </section>

    </>
  );
};

export default LandingPage;
