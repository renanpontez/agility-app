import Image from 'next/image';
import React from 'react';
import { FaEnvelope, FaLaptopCode, FaLinkedin } from 'react-icons/fa6';

import ContactForm from '@/components/ContactForm';
import Hero from '@/components/Hero';
import Link from '@/components/Link';
import SocialIcons from '@/components/SocialIcons/SocialIcons';
import Testimonials from '@/components/Testimonials/Testimonials';
import Text from '@/components/Text';
import { SOCIAL_NETWORKS } from '@/utils/Constants';

// import type { generateMetadata } from '../../boilerplate/guestbook/page';

// export async function generateMetadata() {
//   return {
//     title: 'Sobre Nós - Agility Creative',

//   };
// }

const AboutUsPage: React.FC = () => {
  return (
    <>
      <Hero
        applyMask
        maskClassName="bg-gradient-to-t"
        mediaType="image"
        mediaSrc="/assets/images/desk_working.png"
        style="custom-height"
        videoProps={{ autoPlay: true, loop: true, muted: true, poster: 'https://media.cleanshot.cloud/media/31388/419LxoWlUd6cNz0SXcYoiiMVSKjZR3BffGTVWHjK.jpeg?Expires=1725224290&Signature=WJQfDTU7kg7R6Y78mGl-ylDgJRjReocUGaMd~D9~xQpdHjcj4q8ztAz4oSLwhZeCy6Ki6IzFawTP1WQcpHKPkiD1u~lrBviIPNkffT6wz0tRKPJ0rMh3Pv-Jse53h4Nwf3zW5VdlsVewRx6RxKYyPyLT8NE3XyxWX6t5gdxLsx4m0MUM0Qc30kz1m-HY9SAl5klw96GTPodqrcFRMbleZ8TPRjmgB95OTsIRqBIn2tkWMIc0uTs5be-nCf3JM0sjoT7pBAy59zr6L2G-9MQxEcyzIh~yvIJ0GBFrNIKmQt1NTslbGE5GMMJmLJIB9OFC8vYzstpZuW7Qinakph4UiQ__&Key-Pair-Id=K269JMAT9ZF4GZ' }}
        className="h-[50vh]"
        content={(
          <div className="max-w-lg">
            <Text
              as="h1"
              styleOverride="h1"
              className="font-light leading-normal tracking-wide text-white
          "
            >
              CONHEÇA A
              {' '}
              <br />
              {' '}
              <span className="font-bold">AGILITY CREATIVE</span>
            </Text>
            <Text as="p">
              Somos mais que uma empresa. Somos profissionais apaixonados por soluções.
              Acreditamos em um futuro onde a tecnologia se integra de forma harmoniosa à vida das
              pessoas.
            </Text>
          </div>
        )}
      />

      <section className="mx-auto w-fit max-w-[30%] justify-center py-32 text-center">
        <Testimonials />
      </section>

      <section className="container flex flex-col gap-56 pb-32 pt-16">
        <div className="grid grid-cols-2 gap-16">
          <div className="flex flex-col gap-5">
            <Text as="h3" className="font-light">
              COMO TRANSFORMAMOS IDEIAS EM
              {' '}
              <span className="font-bold">SOLUÇÕES QUE INSPIRAM?</span>
            </Text>
            <Text as="p" className="text-secondaryLighter">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Reiciendis, alias excepturi in sed velit rem eveniet enim aperiam odit nemo ullam praesentium corporis, vero voluptate maxime! Dolore ab quas maiores.
            </Text>
            <ul className="list-disc pl-4 text-secondaryLighter marker:text-primary">
              <li>test</li>
              <li>test</li>
              <li>test</li>
            </ul>

            <Text as="p" className="text-secondaryLighter">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Reiciendis, alias excepturi in sed velit rem eveniet enim aperiam odit nemo ullam praesentium corporis, vero voluptate maxime! Dolore ab quas maiores.
            </Text>
            <Text as="p" className="text-secondaryLighter">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Reiciendis, alias excepturi in sed velit rem eveniet enim aperiam odit nemo ullam praesentium corporis, vero voluptate maxime! Dolore ab quas maiores.
            </Text>

            <progress value="50" max="100" />
            <progress value="64" max="100" />
            <progress value="32" max="100" />
            {/* progress bars */}
          </div>
          <div className="relative flex justify-center">
            <Image
              src="/assets/images/monitors.jpeg"
              // width={450}
              // height={400}
              objectFit="cover"
              layout="fill"
              alt="Agility Creative"
              className="aspect-square rounded-lg"
            />
          </div>
        </div>
      </section>
      {/*
      <section className="container flex flex-col gap-56 px-32 py-16">
        <div className="grid grid-cols-2 gap-16">
          <div className="relative flex justify-center">
            <Image
              src="/assets/images/monitors.jpeg"
              // width={450}
              // height={400}
              objectFit="cover"
              layout="fill"
              alt="Agility Creative"
              className="aspect-square w-full rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-5">
            <Text as="h3" className="font-light">
              POR QUÊ ESCOLHER A AGILITY?
            </Text>
            <Text as="p" className="text-secondaryLighter">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Reiciendis, alias excepturi in sed velit rem eveniet enim aperiam odit nemo ullam praesentium corporis, vero voluptate maxime! Dolore ab quas maiores.
            </Text>
            <ul className="list-disc pl-4 text-secondaryLighter marker:text-primary">
              <li>test</li>
              <li>test</li>
              <li>test</li>
            </ul>
          </div>
        </div>
      </section> */}
      {/* team section */}
      <section className="container flex flex-col gap-16 py-16">
        <Text
          as="h3"
          styleOverride="h2"
          className="text-center leading-normal tracking-wide"
        >
          MENTES CRIATIVAS
          {' '}
          <br />
          QUE MOVEM A
          {' '}
          <span className="text-primary">AGILITY</span>
        </Text>
        <div className="grid grid-cols-3 gap-2">
          {[{
            photo: '/assets/images/renan.jpeg',
            name: 'Renan Martins',
            role: 'Founder | Gerente de Projetos',
            socials: [
              {
                icon: FaLinkedin,
                href: 'https://www.linkedin.com/in/renan-martins-1b1b1b1b1/',
              },
              {
                icon: FaEnvelope,
                href: 'mailto:renanpontez@gmail.com',
              },
            ],
          }, {
            photo: '/assets/images/pedro.jpeg',
            name: 'Pedro Lima',
            role: 'Tech Lead | Front-End Developer',
            socials: [
              {
                icon: FaLinkedin,
                href: 'https://www.linkedin.com/in/pedro-lima-1b1b1b1b1/',
              },
              {
                icon: FaEnvelope,
                href: 'mailto:pedrohblima03@gmail.com',
              },
            ],
          }, {
            photo: '/assets/images/felipe.jpeg',
            name: 'Felipe Macedo',
            role: 'Web Developer',
            socials: [
              {
                icon: FaLinkedin,
                href: 'https://www.linkedin.com/in/felipe-macedo-1b1b1b1b1/',
              },
              {
                icon: FaEnvelope,
                href: 'mailto:femacedogomes@gmail.com',
              },
            ],
          }].map(({ photo, name, role, socials }) => (
            <div className="flex w-full flex-col items-center justify-start bg-secondaryDark" key={name + role}>
              <div className="relative aspect-square w-full opacity-50 transition hover:opacity-100">
                <Link href={socials[0]?.href ?? '/'}>
                  <Image
                    src={photo}
                    objectFit="cover"
                    layout="fill"
                    alt="Agility Creative"
                    className="aspect-square"
                  />
                </Link>
              </div>
              <div className="flex flex-col py-16">
                <Text as="h4" className="text-center">
                  {name}
                  {' '}
                </Text>
                <Text as="small" className="text-center text-primaryLighter">{role}</Text>
                <div className="mt-6 flex justify-center gap-4">
                  <SocialIcons />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* clients */}
      <section className="container flex flex-col gap-16 py-16">
        <div className="grid grid-cols-4 items-center gap-y-16 py-16">
          {[1, 2, 3, 4].map(item => (
            <div key={item} className="relative h-12 w-full text-center">
              <Image
                src="/assets/images/clients/dynotest.png"
                // width={450}
                // height={400}
                objectFit="contain"
                layout="fill"
                alt="Agility Creative"
                className="aspect-square"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col py-16" id="Servicos">
        <Hero
          applyMask
          maskClassName="bg-gradient-to-l"
          mediaType="image"
          mediaSrc="/assets/images/keyboard.webp"
          style="auto-height"
          altText="A desk containing a laptop, a notebook, and a cup of coffee"

          content={(
            <div className="flex flex-col gap-16 py-32">
              <Text
                as="h3"
                styleOverride="h2"
                className="text-center font-light leading-normal tracking-wide"
              >
                SERVIÇOS COM A
                <br />
                {' '}
                <span className="font-bold">QUALIDADE AGILITY</span>
              </Text>
              <div className="container grid grid-cols-1 gap-32 md:grid-cols-3">
                {[{
                  icon: FaLaptopCode,
                  title: 'Desenvolvimento e Tecnologia',
                  description: 'Nossos desenvolvedores são especialistas em diversas tecnologias e estão prontos para transformar suas ideias em soluções digitais.',
                }, {
                  icon: FaLaptopCode,
                  title: 'Design e Criatividade',
                  description: 'Nossos designers são apaixonados por criar experiências únicas e inesquecíveis para os usuários.',
                }, {
                  icon: FaLaptopCode,
                  title: 'Marketing e Estratégia',
                  description: 'Nossa equipe de marketing está sempre pronta para ajudar a sua empresa a alcançar os melhores resultados.',
                }].map(item => (
                  <div key={item.title} className="flex flex-col gap-10">
                    <div className="flex items-center justify-center">
                      <item.icon className="text-primaryLighter transition hover:text-primaryLight" size={36} />
                    </div>
                    <div className="flex flex-col gap-2 text-center">
                      <Text as="h5">{item.title}</Text>
                      <Text as="small">{item.description}</Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        />

      </section>

      <section className="container flex w-full justify-between py-16">
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
          <ContactForm />
        </div>
      </section>
    </>
  );
};

export default AboutUsPage;
