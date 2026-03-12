'use client';

import { useState } from 'react';

import type { PortfolioItem } from '@/components/landing-v2';
import { PortfolioCard, RevealOnScroll } from '@/components/landing-v2';

const PORTFOLIO_FILTERS = ['Todos', 'Site', 'Landing Page', 'App', 'Design'] as const;

const PORTFOLIO: PortfolioItem[] = [
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
  {
    name: 'Dra. Barbarela Freire',
    category: 'Site Profissional',
    type: 'Site',
    description: 'Site elegante e acolhedor para psiquiatra, com foco em agendamento de consultas e presença digital em saúde mental.',
    image: '/assets/images/portfolio/dra-barbarela-freire/thumbnail.webp',
    slug: 'dra-barbarela-freire',
  },
];

const PortfolioPage = () => {
  const [activeFilter, setActiveFilter] = useState<string>('Todos');

  const filteredPortfolio = activeFilter === 'Todos'
    ? PORTFOLIO
    : PORTFOLIO.filter(p => p.type === activeFilter);

  return (
    <div className="pb-20 pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 xl:px-0">
        <RevealOnScroll>
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-primary/70">
              Portfólio
            </span>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Nossos
              {' '}
              <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
                projetos
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-lg text-white/50">
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
    </div>
  );
};

export default PortfolioPage;
