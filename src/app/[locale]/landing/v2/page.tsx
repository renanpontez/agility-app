'use client';

import React from 'react';

import { Card } from '@/components/Card';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Text from '@/components/Text';

const HeaderTitle: React.ReactNode = (
  <Text as="h1" styleOverride="h1" className="font-light leading-normal tracking-wide text-white">
    TRANSFORMANDO IDEIAS EM
    <br />
    <Text as="h1" className="leading-normal tracking-wide">SOLUÇÕES QUE INSPIRAM</Text>
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
          title={HeaderTitle}
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

        <div className="mx-auto justify-center text-center">
          <Text as="h2">
            O QUE DIZEM NOSSOS PARCEIROS
          </Text>
          <div>
            {
              [{
                name: 'John Doe',
                title: 'CEO da Empresa X',
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe, quas.',
              }, {
                name: 'Jane Doe',
                title: 'CEO da Empresa Y',
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe, quas.',
              }, {
                name: 'John Doe',
                title: 'CEO da Empresa Z',
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe, quas.',
              }].map(item => (
                <Card key={item.name}>
                  <Text as="h3">{item.name}</Text>
                  <Text as="h4">{item.title}</Text>
                  <Text as="p">{item.description}</Text>
                </Card>
              ))
            }
          </div>
        </div>
        <div style={{ minHeight: 2000 }}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        </div>
      </div>
    </>
  );
};

export default LandingPage;
