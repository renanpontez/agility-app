'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CgWebsite } from 'react-icons/cg';
import { FaWhatsapp } from 'react-icons/fa';
import { IoCartOutline, IoPhonePortraitOutline } from 'react-icons/io5';
import { TbDeviceAnalytics } from 'react-icons/tb';

import type { FaqItem, PortfolioItem, ServiceCardData } from '@/components/landing-v2';
import {
  ContactSection,
  FaqAccordion,
  PortfolioCard,
  RevealOnScroll,
  ScrollBanner,
  ServiceCard,
  TechTicker,
  V2Hero,
} from '@/components/landing-v2';

/* ───────────────────────────── DATA ───────────────────────────── */

const SERVICES: ServiceCardData[] = [
  {
    icon: CgWebsite,
    title: 'Sites & Landing Pages',
    description: 'Sites que realmente entregam resultados para seu projeto. Design moderno com foco em performance e conversão.',
    color: 'bg-blue-500/10 text-blue-400',
  },
  {
    icon: IoPhonePortraitOutline,
    title: 'Aplicativos & Jogos',
    description: 'Apps e jogos personalizados transformados em realidade. Do conceito à publicação nas lojas.',
    color: 'bg-green-500/10 text-green-400',
  },
  {
    icon: IoCartOutline,
    title: 'Lojas Virtuais & E-commerce',
    description: 'Aproveite a expansão do mercado com vendas online. Plataformas otimizadas para converter visitantes em clientes.',
    color: 'bg-amber-500/10 text-amber-400',
  },
  {
    icon: TbDeviceAnalytics,
    title: 'Consultoria & Tecnologia',
    description: 'Foco total em otimizar os resultados do seu projeto. Consultoria especializada para escalar seu negócio.',
    color: 'bg-purple-500/10 text-purple-400',
  },
];

const PORTFOLIO_FILTERS = ['Todos', 'Site', 'Landing Page', 'App', 'Design'] as const;

const PORTFOLIO: PortfolioItem[] = [
  {
    name: 'Dra. Barbarela Freire',
    category: 'Site Profissional',
    type: 'Site',
    description: 'Site elegante e acolhedor para psiquiatra, com foco em agendamento de consultas e presença digital em saúde mental.',
    image: '/assets/images/portfolio/dra-barbarela-freire/thumbnail.png',
    slug: 'dra-barbarela-freire',
  },
  {
    name: 'MR Advogados',
    category: 'Site Corporativo',
    type: 'Site',
    description: 'Site moderno desenvolvido em WordPress para o escritório Monteiro & Rolim Advocacia, com design responsivo e foco em performance.',
    image: '/assets/images/portfolio/mr-advogados/thumbnail.webp',
    slug: 'mr-advogados',
  },
  {
    name: 'EasyToLive',
    category: 'Aplicativo Web & Design',
    type: 'App',
    description: 'Design de aplicativo focado em MVP prático e bonito, com UI/UX intuitivo e feedback positivo do cliente.',
    image: '/assets/images/portfolio/easytolive_cover.webp',
    slug: 'easytolive',
  },
  {
    name: 'Academia Cearense de Economia',
    category: 'Site Institucional',
    type: 'Site',
    description: 'Site institucional para modernizar a presença digital da academia, com área de membros e gestão de eventos.',
    image: '/assets/images/portfolio/academia_cover.webp',
    slug: 'academia-cearense-de-economia',
  },
  {
    name: 'Agillock',
    category: 'Landing Page',
    type: 'Landing Page',
    description: 'Landing page moderna e dinâmica desenvolvida em Next.js, com foco em presença online e captação de leads.',
    image: '/assets/images/portfolio/agillock_cover.webp',
    slug: 'agillock',
  },
  {
    name: 'Agility',
    category: 'Branding & Design',
    type: 'Design',
    description: 'Modernização completa da identidade visual — logo, tipografia e paleta de cores para reposicionar a marca.',
    image: '/assets/images/portfolio/agility/thumbnail.webp',
    slug: 'agility',
  },
  {
    name: 'Dynotest',
    category: 'Site Corporativo',
    type: 'Site',
    description: 'Site para posicionamento de marca com integração WhatsApp para contato direto e aumento de conversões.',
    image: '/assets/images/portfolio/dynotest_cover.webp',
    slug: 'dynotest',
  },
];

const FAQ: FaqItem[] = [
  {
    q: 'Quanto tempo leva para desenvolver um projeto?',
    a: 'O prazo depende da complexidade do projeto. Landing pages podem ficar prontas em 1-2 semanas, enquanto aplicativos mais complexos podem levar de 2 a 4 meses. Sempre definimos um cronograma claro antes de iniciar.',
  },
  {
    q: 'Vocês trabalham com empresas de qualquer tamanho?',
    a: 'Sim! Atendemos desde startups e empreendedores individuais até empresas de médio porte. Adaptamos nossas soluções para atender as necessidades e orçamento de cada cliente.',
  },
  {
    q: 'Como funciona o processo de trabalho?',
    a: 'Começamos com uma conversa para entender suas necessidades. Depois, criamos um escopo detalhado, desenvolvemos o projeto em sprints com entregas parciais, e finalizamos com testes e ajustes. Você acompanha tudo de perto.',
  },
  {
    q: 'Oferecem suporte após a entrega?',
    a: 'Sim, oferecemos suporte pós-entrega para garantir que tudo funcione perfeitamente. Também disponibilizamos planos de manutenção contínua para atualizações e melhorias.',
  },
];

/* ───────────────────────────── PAGE ───────────────────────────── */

const LandingPage = () => {
  const [activeFilter, setActiveFilter] = useState<string>('Todos');

  const filteredPortfolio = activeFilter === 'Todos'
    ? PORTFOLIO
    : PORTFOLIO.filter(p => p.type === activeFilter);

  return (
    <>
      {/* ─── HERO ─── */}
      <V2Hero />

      {/* ─── TECH LOGOS TICKER ─── */}
      <TechTicker />

      {/* ─── ABOUT US ─── */}
      <section id="Sobre" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 xl:px-0">
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
            <RevealOnScroll className="flex-1">
              <div className="grid h-[400px] grid-cols-2 grid-rows-2 gap-3 sm:h-[450px]">
                <div className="flex flex-col justify-end rounded-2xl bg-white/[0.04] p-6">
                  <span className="text-4xl font-bold text-white">30+</span>
                  <span className="mt-1 text-sm text-white/40">Projetos entregues</span>
                </div>
                <div className="relative row-span-2 overflow-hidden rounded-2xl">
                  <Image src="/assets/images/about-us-img.svg" alt="Sobre a Agility" fill className="object-cover" />
                </div>
                <div className="relative overflow-hidden rounded-2xl">
                  <Image src="/assets/images/agility-team-working.jpeg" alt="Ambiente de trabalho" fill className="object-cover" />
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={150} className="flex flex-1 flex-col justify-center gap-6">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary/70">
                Sobre nós
              </span>
              <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                Construindo soluções que transformam o futuro.
              </h2>
              <p className="text-lg leading-relaxed text-white/60">
                A gente acredita que organizando o processo criativo e trabalhando em
                parceria com o cliente, conseguimos multiplicar os resultados do seu
                projeto.
              </p>
              <p className="text-lg leading-relaxed text-white/60">
                A Agility tem como meta entregar sempre mais do que o esperado. Nós
                seremos uma parceria leve que vai te levar para mais perto do sucesso
                do seu projeto!
              </p>
              <a
                href="#Contato"
                className="mt-2 w-fit rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium text-white/80 transition-all hover:border-primary/40 hover:text-primary"
              >
                Saiba mais
              </a>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section id="Servicos" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 xl:px-0">
          <RevealOnScroll>
            <div className="mx-auto mb-14 max-w-xl text-center">
              <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-primary/70">
                Nossos serviços
              </span>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Encontramos a solução
                {' '}
                <span className="text-primary">mais eficiente</span>
                {' '}
                para seu projeto
              </h2>
              <p className="mx-auto mt-4 max-w-md text-white/50">
                Descubra como podemos impulsionar o seu negócio com tecnologia, design e estratégia.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service, i) => (
              <ServiceCard key={service.title} service={service} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── HORIZONTAL BANNER ─── */}
      <ScrollBanner />

      {/* ─── PORTFOLIO ─── */}
      <section id="Portfolio" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 xl:px-0">
          <RevealOnScroll>
            <div className="mx-auto mb-10 max-w-lg text-center">
              <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-primary/70">
                Portfólio
              </span>
              <h2 className="max-w-md text-2xl font-bold tracking-tight md:text-4xl">
                Projetos que fizeram a
                {' '}
                <span className="text-primary">diferença</span>
                {' '}
                na nossa história
              </h2>
              <p className="mx-auto mt-4 max-w-md text-white/50">
                Conheça alguns dos diversos projetos que desenvolvemos para nossos clientes.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
              {PORTFOLIO_FILTERS.map(filter => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${activeFilter === filter
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'border border-white/10 text-white/50 hover:border-white/20 hover:text-white/80'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-3">
            {filteredPortfolio.map((item, i) => (
              <PortfolioCard key={item.slug} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── PARALLAX CTA ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/agility-team-working.jpeg"
            alt="Agility team"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
          <RevealOnScroll>
            <div className="max-w-xl">
              <h2 className="mb-6 text-3xl font-bold leading-tight md:text-4xl">
                Mentes
                {' '}
                <span className="text-primary">criativas</span>
                {' '}
                e processos
                {' '}
                <span className="text-primary">organizados</span>
                {' '}
                geram mais resultados
              </h2>
              <p className="mb-8 text-lg text-white/60">
                Para qualquer projeto digital, contar com uma equipe experiente faz toda a diferença.
              </p>
              <a
                href="#Contato"
                className="inline-flex rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
              >
                CONHEÇA A AGILITY
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <RevealOnScroll>
            <div className="mb-14 text-center">
              <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-primary/70">
                FAQ
              </span>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Perguntas frequentes
              </h2>
            </div>
          </RevealOnScroll>
          <FaqAccordion items={FAQ} />
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <ContactSection />

      {/* ─── FINAL CTA ─── */}
      <section className="bg-primary py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <RevealOnScroll>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Pronto para transformar seu projeto?
            </h2>
            <p className="mx-auto mb-10 max-w-lg text-lg text-white/70">
              Vamos conversar sobre como podemos ajudar a levar seu negócio para o próximo nível.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#Contato"
                className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-primary transition-all hover:bg-white/90 hover:shadow-lg"
              >
                Falar com a Agility
              </a>
              <a
                href="https://wa.me/+5585996284730"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/20"
              >
                <FaWhatsapp size={16} />
                WhatsApp direto
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {['Sem compromisso', 'Resposta em 24h', 'Equipe especializada'].map(item => (
                <span key={item} className="flex items-center gap-1.5 text-xs text-white/60">
                  <svg className="size-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </span>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
