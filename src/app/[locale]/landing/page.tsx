'use client';

import Head from 'next/head';
import Image from 'next/image';
import React, { useState } from 'react';

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handlePortfolioClick = (category: string) => {
    // eslint-disable-next-line no-console
    console.log(`Portfolio category clicked: ${category}`);
  };

  const goToWhatsapp = () => {
    window.open('https://wa.me/yourphonenumber', '_blank');
  };

  return (
    <>
      <Head>
        <title>Agility Creative - Soluções Digitais Inteligentes</title>
        <link rel="icon" href="/agility_ico.ico" type="image/x-icon" />
      </Head>

      <div className="container mx-auto flex size-full flex-col items-center bg-gradient-to-r to-black px-4 text-white">

        {/* HEADER */}
        <div className="fixed top-0 z-50 flex h-20 min-w-full items-center bg-black px-7 py-4 shadow-md">
          <div className="flex w-full justify-between">
            <div className="flex items-center gap-4 p-3 text-white">
              <Image width={44} height={38} src="/assets/images/logo_purple.svg" alt="Logo" />
              <Image width={135} height={40} src="/assets/images/logoname.svg" alt="Logo Name" />
            </div>
            <div className="my-auto h-full">
              <div id="normal-menu" className="m-auto hidden items-center justify-center gap-10 md:flex">
                <a className="hover:font-bold" href="#Home" target="_self">Home</a>
                <a className="hover:font-bold" href="#Servicos" target="_self">Sobre a Agility</a>
                <a className="hover:font-bold" href="#Portfolio" target="_self">Projetos</a>
                <a className="hover:font-bold" href="#FaleConosco" target="_self">Falar com a gente</a>
              </div>
              <button
                id="menu-button"
                className="visible mr-6 md:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
                type="button"
              >
                &#9776;
              </button>
              {menuOpen && (
                <div
                  id="menu-burguer"
                  className=" absolute left-0 top-0 flex h-screen w-full flex-col rounded-3xl p-5 md:p-0"
                >
                  <div className="flex items-center gap-4 px-5 py-3 text-white">
                    <Image width={44} height={38} src="/assets/images/logo_purple.svg" alt="Logo" />
                    <button
                      id="close-button"
                      className="absolute right-10 top-10 text-2xl md:hidden"
                      onClick={() => setMenuOpen(false)}
                      type="button"
                    >
                      &times;
                    </button>
                  </div>
                  <ul className="mt-10 flex flex-col gap-5 text-center shadow-md md:hidden">
                    <li><a className="hover:font-bold" href="#Home">Home</a></li>
                    <li><a className="hover:font-bold" href="#Servicos">Sobre a Agility</a></li>
                    <li><a className="hover:font-bold" href="#Portfolio">Projetos/Portfólio</a></li>
                    <li><a className="hover:font-bold" href="#FaleConosco">Falar com a gente</a></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-20 md:space-y-40">

          {/* HOME SECTION */}
          <section id="Home" className="w-full items-center justify-between pt-36 md:pt-56">
            <div className="grid grid-cols-12 gap-y-14">
              <div className="col-span-12 flex flex-col gap-4 py-2 md:col-span-7 md:py-8">
                <h1 className="text-center text-5xl font-bold text-white md:text-left">
                  SOMOS
                  {' '}
                  <span className="text-primary">AGILITY</span>
                </h1>
                <div className="relative w-full">
                  <p className="-mt-5 px-4 text-center text-2xl font-medium sm:px-0 md:text-left">
                    Sua presença digital de forma
                    {' '}
                    <span className="text-2xl font-medium text-primary">
                      <span id="randomTextElement" className="w-32"></span>
                    </span>
                  </p>
                </div>
                <div className="mt-3 text-center sm:mt-10 md:text-left">
                  <a className="rounded-full bg-primaryDark px-8 py-2 pt-3 font-bold" href="#Servicos">Conhecer a Agility</a>
                </div>
              </div>
              <div className="col-span-12 flex-col md:col-span-5">
                <Image src="/assets/images/header_img.png" className="w-full" alt="Header Image" width={1280} height={400} />
              </div>
            </div>
          </section>
          {/* SERVICES SECTION */}
          <section id="Servicos" className="mt-24 grid w-full grid-cols-12 flex-wrap justify-between gap-4 md:gap-10">
            <div className="md:col-span-5md:mb-20 col-span-12 mb-10 flex flex-col items-center text-center  md:items-start md:text-left">
              <a href="#Servicos" className="mb-10 w-fit rounded-3xl bg-gray-500 px-4 py-2 pt-3 text-sm font-bold leading-normal">
                Nossos serviços
              </a>
              <h2 className="text-3xl font-bold">
                Entregamos a solução
                {' '}
                <p className="text-primary">mais eficiente</p>
                {' '}
                para seu projeto!
              </h2>
              <p className="mb-12 mt-4">
                Descubra como podemos impulsionar o seu negócio.
                <br />
                {' '}
                conheça mais sobre nossos serviços.
              </p>
              <a href="#Portfolio" className="w-fit rounded-3xl bg-primary px-10 py-3 font-bold">Veja nosso portfólio</a>
            </div>
            <div className="col-span-12 flex grid-cols-2 flex-wrap items-center justify-center gap-10 text-center sm:grid md:col-span-7 md:gap-6 md:gap-x-12 md:text-left">
              <div className="relative w-full">
                <h4 className="text-xl">Tecnologia</h4>
                <span className="relative flex h-px w-full max-w-full items-center rounded-full bg-gray-500 pr-8">
                  <span className="absolute left-0 h-px w-10 bg-primary"></span>
                </span>
                <p className="my-2 text-lg md:mb-0 md:mt-4">App, Sites, Bots, AI e mais</p>
                <p className="text-sm">Explore nossos serviços em desenvolvimento de apps, sites, bots e inteligência artificial. Elevamos sua presença digital com tecnologia de ponta.</p>
              </div>
              <div className="relative w-full">
                <h4 className="text-xl">Marca</h4>
                <span className="absolute flex h-px w-full max-w-full items-center rounded-full bg-gray-500 pr-8">
                  <span className="absolute left-0 h-px w-10 bg-primary"></span>
                </span>
                <p className="my-2 text-lg md:mb-0 md:mt-4">Design e identidade</p>
                <p className="text-sm">Criamos identidades visuais que capturam a essência de sua marca, destacando você no mercado. Do logotipo ao design completo, cuidamos da sua marca.</p>
              </div>
              <div className="relative w-full">
                <h4 className="text-xl">Social</h4>
                <span className="absolute flex h-px w-full max-w-full items-center rounded-full bg-gray-500 pr-8">
                  <span className="absolute left-0 h-px w-10 bg-primary"></span>
                </span>
                <p className="my-2 text-lg md:mb-0 md:mt-4">Redes Sociais e Marketing</p>
                <p className="text-sm">Amplie seu alcance com estratégias de redes sociais e marketing digital eficazes. Conecte-se ao seu público e aumente o engajamento de forma criativa.</p>
              </div>
              <div className="relative w-full">
                <h4 className="text-xl">Consultoria & Suporte</h4>
                <span className="absolute flex h-px w-full max-w-full items-center rounded-full bg-gray-500 pr-8">
                  <span className="absolute left-0 h-px w-10 bg-primary"></span>
                </span>
                <p className="my-2 text-lg md:mb-0 md:mt-4">Agilidade em Tecnologia</p>
                <p className="text-sm">Oferecemos consultoria e suporte em tecnologia para otimizar sua infraestrutura de TI. Nossos especialistas implementam soluções eficientes ao lado da sua equipe.</p>
              </div>
            </div>
          </section>

          {/* PORTFOLIO SECTION */}
          <section id="Portfolio" className="flex w-full flex-col items-center justify-between">
            <a className="mb-10 rounded-3xl bg-gray-500 px-4 py-2 pt-3 text-sm leading-normal" href="#Portfolio">
              Nosso Portfolio
            </a>
            <h2 className="w-full text-wrap text-center text-3xl font-bold">
              Projetos que fizeram a
              {' '}
              <strong className="text-primary">diferença</strong>
              {' '}
              na nossa história
            </h2>
            <p className="mb-12 w-full text-wrap pt-4 text-center">
              Descubra como podemos impulsionar o seu negócio. Conheça mais sobre nossos serviços.
            </p>
            <div className="flex gap-3 rounded-3xl bg-gray-500 px-6 py-2 text-sm">
              <button type="button" className="m-auto px-2 py-1 leading-normal hover:font-bold focus:text-white active:scale-95" onClick={() => handlePortfolioClick('todos')}>Todos</button>
              <button type="button" className="m-auto px-2 py-1 leading-normal hover:font-bold focus:text-white active:scale-95" onClick={() => handlePortfolioClick('tecnologia')}>Tecnologia</button>
              <button type="button" className="m-auto px-2 py-1 leading-normal hover:font-bold focus:text-white active:scale-95" onClick={() => handlePortfolioClick('design')}>Design</button>
              <button type="button" className="m-auto hidden px-2 py-1 leading-normal hover:font-bold focus:text-white active:scale-95 sm:block" onClick={() => handlePortfolioClick('outros')}>Outros</button>
            </div>
            <div id="NoPortfolioMessage" className=" mx-auto mt-10 hidden w-2/3 text-center">
              <em className="text-center">
                Nenhum projeto encontrado. Quer ser o primeiro?
                <br />
                {' '}
                <a className="text-primary" href="#FaleConosco">Fale com a Agility</a>
              </em>
            </div>
            <div className="mx-auto mt-16 grid w-full grid-cols-1 flex-wrap items-center justify-center gap-6 md:grid-cols-2">
              <div className="flex cursor-pointer flex-col items-center p-3" data-portfolio-category="tecnologia,design">
                <div className="mb-4 rounded-3xl bg-primary text-center">
                  <Image width={250} height={250} src="/assets/images/portfolio_1.png" alt="EasyToLive" className="h-auto w-full" />
                </div>
                <p className=" mx-auto w-3/4 text-center font-bold">EasyToLive</p>
                <div className="mx-auto cursor-pointer text-center">Aplicativo Web & Design</div>
              </div>
              <div className="flex cursor-pointer flex-col items-center p-3" data-portfolio-category="tecnologia">
                <div className="mb-4 rounded-3xl bg-primary text-center">
                  <Image width={250} height={250} src="/assets/images/portfolio_2.png" alt="Academia Cearense de Economia" className="h-auto w-full" />
                </div>
                <p className=" mx-auto w-3/4 text-center font-bold">Academia Cearense de Economia</p>
                <div className="mx-auto cursor-pointer text-center">Site Corporativo</div>
              </div>
              <div className="flex cursor-pointer flex-col items-center p-3" data-portfolio-category="tecnologia">
                <div className="mb-4 rounded-3xl bg-primary text-center">
                  <Image width={250} height={250} src="/assets/images/portfolio_3.png" alt="Scrummy Poker" className="h-auto w-full" />
                </div>
                <p className=" mx-auto w-3/4 text-center font-bold">Scrummy Poker</p>
                <div className="mx-auto cursor-pointer text-center">Aplicativo Web</div>
              </div>
              <div className="flex cursor-pointer flex-col items-center p-3" data-portfolio-category="tecnologia">
                <div className="mb-4 rounded-3xl bg-primary text-center">
                  <Image width={250} height={250} src="/assets/images/portfolio_4.png" alt="Dynotest Performance Solutions" className="h-auto w-full" />
                </div>
                <p className=" mx-auto w-3/4 text-center font-bold">Dynotest Performance Solutions</p>
                <div className="mx-auto cursor-pointer text-center">Site Corporativo</div>
              </div>
            </div>
          </section>
          {/* CONTACT US SECTION */}
          <section id="FaleConosco" className="grid w-full grid-cols-1 justify-between gap-20 md:grid-cols-2">
            <div className="mt-14 flex flex-col text-center md:mt-0">
              <a href="#FaleConosco" className="mx-auto mb-10 flex w-fit rounded-3xl bg-gray-500 px-4 py-2 pt-3 text-sm font-bold leading-normal md:mx-0">
                Entre em contato
              </a>
              <h2 className="text-center text-4xl md:text-left">
                Quer falar com a gente?
                <br />
                <strong className="text-primary">manda um OI!</strong>
              </h2>
              <div className="mt-8 flex w-full flex-col justify-center gap-4 text-start">
                <a href="mailto:hi@agilitycreative.com" className="flex items-center justify-center gap-3 md:justify-start">
                  <Image src="/assets/icons/email.svg" alt="email-icon" width={24} height={24} />
                  hi@agilitycreative.com
                </a>
                <a href="https://instagram.com/agilitycreative" target="_blank" className="flex items-center justify-center gap-3 md:justify-start" rel="noreferrer nooponer">
                  <Image src="/assets/icons/instagram.svg" alt="instagram-icon" width={24} height={24} />
                  @agilitycreative
                </a>
              </div>
            </div>
            <div className="w-full max-w-full rounded-3xl bg-primaryDark p-8 shadow-xl">
              <p className="text-lg">Fale com a gente</p>
              <p className="mb-6 text-sm text-gray-300">Quer conversar sobre um projeto ou conhecer mais a Agility? Manda uma mensagem pra gente.</p>
              <form action="" method="post" className="flex flex-col gap-3 bg-primaryDark">
                <input type="text" id="contact-name" placeholder="Seu nome" className="rounded-2xl border border-gray-500 bg-primaryDark p-2 px-4" />
                <input type="email" id="contact-email" placeholder="Seu e-mail" className="rounded-2xl border border-gray-500 bg-primaryDark p-2 px-4" />
                <textarea name="" id="contact-message" rows={6} placeholder="Sua mensagem" className="rounded-2xl border border-gray-500 bg-primaryDark p-2 px-3"></textarea>
              </form>
              <button onClick={goToWhatsapp} className="relative mt-8 flex w-full items-center justify-center rounded-3xl bg-primary py-3 font-bold active:scale-95" type="button">
                Entrar em contato
                {' '}
                <Image src="/assets/social/whatsapp.svg" alt="wpp-image" width={27} height={27} className="absolute right-2" />
              </button>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="mt-32 flex w-full min-w-[100vw] items-center justify-around bg-primaryDarker py-10">
          <div className="flex flex-col items-start gap-3 text-xs">
            <p className=" mb-2 font-bold text-white">Nosso site</p>
            <a href="#Home">Inicio</a>
            <a href="#SobreNos">Sobre nós</a>
            <a href="#Servicos">Nossos serviços</a>
            <a href="#Portfolio">Portfólio</a>
            <a href="#FaleConosco">Entre em contato</a>
          </div>
          <div>
            <div className="flex gap-4">
              <Image width={36} height={28} src="/assets/images/logo.svg" alt="agility-logo" />
              <Image width={90} height={26} src="/assets/images/logoname.svg" alt="agility-logo-name" />
            </div>
            <p className="mt-4 max-w-40 text-xs text-gray-300">Transformamos ideias brilhantes em soluções reais para impulsionar o sucesso dos nossos clientes.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
