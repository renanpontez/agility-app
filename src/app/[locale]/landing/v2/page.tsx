'use client';

import Image from 'next/image';
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa6';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Footer } from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import { Input } from '@/components/Input';
import Logo from '@/components/Logo';
import Text from '@/components/Text';
import { TextArea } from '@/components/TextArea';
import { SOCIAL_NETWORKS } from '@/utils/Constants';

const HeaderTitle: React.ReactNode = (
  <Text as="h1" styleOverride="h1" className="font-light leading-normal tracking-wide text-white">
    TRANSFORMANDO IDEIAS EM
    <br />
    <span className="font-bold tracking-wider">SOLUÇÕES QUE INSPIRAM</span>
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
          style="custom-height"
          videoProps={{ autoPlay: true, loop: true, muted: true }}
          content={HeaderTitle}
          className="h-[80vh]"
        />

        <div className="container relative -mt-16">
          <Card className="mx-auto w-full">
            <div className="flex items-center justify-between px-16 py-2">
              {
                [{
                  title: '11',
                  description: 'ANOS DE EXPERIÊNCIA',
                }, {
                  title: '+50',
                  description: 'PROJETOS CONCLUÍDOS',
                }, {
                  title: '+90%',
                  description: 'APROVAÇÃO DOS PARCEIROS',
                }, {
                  title: '5',
                  description: 'MENTES CRIATIVAS',
                }].map(item => (
                  <div key={item.title} className="flex flex-col items-center justify-center">
                    <Text as="h2" className="text-primary">{item.title}</Text>
                    <Text as="p">{item.description}</Text>
                  </div>
                ))
              }
            </div>
          </Card>
        </div>

        <section className="mx-auto w-fit max-w-[30%] justify-center py-32 text-center">
          <Text as="h2">
            O QUE NOSSOS CLIENTES FALAM
          </Text>
          <div className="relative">
            <div className="absolute -left-5 -top-5">
              <Text as="p" className="font-serif text-5xl italic text-primary opacity-50">"</Text>
            </div>
            <div className="mt-8 flex w-fit flex-col gap-2 px-5 ">
              <Text as="p" className="tracking-wider">
                Nossa presença digital foi transformada com um site que superou expectativas. O resultado impulsionou nossos negócios, e a experiência com a equipe foi excepcional!
              </Text>
              <Text as="em" className="text-secondaryLight">
                Leandro P | Agillock Gestão de Risco
              </Text>
            </div>
            <div className="absolute -bottom-10 -right-5">
              <Text as="p" className="font-serif text-5xl italic text-primary opacity-50">"</Text>
            </div>
          </div>
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
              <div className="flex max-w-[35%] flex-col items-start gap-5 py-24 text-left">
                <Logo symbolColor="primary" />
                <Text as="p">
                  A gente acredita que organizando o processo criativo e trabalhando em parceria com o cliente, conseguimos multiplicar os resultados do seu projeto.
                </Text>
                <Text as="p">
                  Descubra como podemos impulsionar o seu negócio de maneira ágil e confiável.
                </Text>
                <Button style="outlined-light" size="sm">
                  NOSSOS PROJETOS
                </Button>
              </div>
            )}
          />
        </section>

        <section className="mx-auto max-w-[50%] py-24 text-center">
          <Text as="h2" styleOverride="h1">
            PROJETOS QUE FIZERAM A
            <br />
            <span className="text-primary">DIFERENÇA</span>
            {' '}
            NA NOSSA HISTÓRIA
          </Text>
          <Text as="em">
            Conheça os cases de sucesso que nos inspiram a cada dia.
          </Text>
          <div className="mt-10 grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map(item => (
              <Card key={item} className="aspect-square w-full bg-secondaryDark" />
            ))}

          </div>
          <div>
            {/* TODO: PORTFOLIO COMPONENT */}
          </div>
        </section>

        <section className="w-full py-24 text-center">
          <Hero
            applyMask
            mediaType="image"
            mediaSrc="/assets/images/tablet_working.png"
            style="auto-height"
            altText="An amazing hero image"
            content={(
              <div className="mx-auto flex max-w-[35%] flex-col items-center gap-5 py-24 text-center">
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
          <div className="flex justify-between">
            {[{
              icon: '/assets/images/icons/tech.svg',
              title: 'Design único e tecnologia sempre atual',
              description: 'Criamos experiências digitais memoráveis combinando design inovador com a tecnologia mais adequada. Seu projeto será único e eficiente.',
            }, {
              icon: '/assets/images/icons/tech.svg',
              title: 'Comunicação transparente e constante',
              description: 'Valorizamos a transparência e mantemos uma comunicação constante. Esteja sempre atualizado sobre o progresso do seu projeto.',
            }, {
              icon: '/assets/images/icons/tech.svg',
              title: 'Qualidade e suporte',
              description: 'Comprometidos com a excelência, garantimos a qualidade em cada etapa. Além disso, oferecemos suporte contínuo para garantir o sucesso contínuo do seu projeto.',
            }].map(item => (
              <Card key={item.title} className="flex w-[350px] flex-col items-center justify-center gap-5 bg-secondaryDark p-10 text-center" shadow="lg">
                <Image src={item.icon} alt="Icon" width={50} height={50} />
                <div className="flex flex-col gap-3">
                  <Text as="h5">{item.title}</Text>
                  <Text as="p">{item.description}</Text>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="container my-24 flex w-full justify-between">
          <div className="flex flex-col gap-10">
            <Text as="h2" styleOverride="h1">
              ENTRE EM CONTATO
              <br />
              COM A
              {' '}
              <span className="text-primary">AGILITY</span>
            </Text>
            <div className="flex flex-col gap-3">
              {SOCIAL_NETWORKS.map(item => (
                <div key={item.title} className="flex items-center gap-2">
                  <item.icon className="text-sm text-primaryLighter " />
                  <a href={item.href} className="text-sm" target="_blank" rel="noopener noreferrer">
                    <Text as="p" size="sm" className="hover:text-primaryLighter">{item.title}</Text>
                  </a>
                </div>
              ))}
            </div>
          </div>
          <div>
            <form className="flex min-w-84 flex-col gap-2">
              <div>
                <Input type="text" placeholder="Antonio Araujo" label="Nome e Sobrenome" />
              </div>
              <div>
                <Input type="email" placeholder="contato@araujocolchoes.com.br" label="E-mail" />
              </div>
              <div>
                <TextArea
                  // onChange={e => setText(e.target.value)}
                  placeholder="Conta pra gente como podemos ajudar seu projeto"
                  label="Sua mensagem"
                />
              </div>
              <div>
                <Button style="primary" size="lg" fullWidth>
                  <span>Enviar mensagem</span>
                  <span className="ml-2"><FaWhatsapp size={14} /></span>
                </Button>
              </div>
            </form>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
