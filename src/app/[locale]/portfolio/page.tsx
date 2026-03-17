import type { PortfolioItem } from '@/components/landing-v2';
import { PageHero, PortfolioGrid } from '@/components/landing-v2';

const PORTFOLIO: PortfolioItem[] = [
  {
    name: 'Circle Picks',
    category: 'Plataforma Social',
    type: 'App',
    description: 'Plataforma social para descobrir restaurantes e bares através de recomendações de pessoas que você confia.',
    image: 'https://placehold.co/800x600/1a1a2e/FD512E/png?text=Circle+Picks',
    slug: 'circlepicks',
  },
  {
    name: 'myhouz',
    category: 'SaaS & App',
    type: 'App',
    description: 'SaaS de gestão doméstica para casais, roommates e famílias. Um lugar para tudo que precisa ser rastreado ou feito.',
    image: 'https://placehold.co/800x600/1a1a2e/4F46E5/png?text=myhouz',
    slug: 'myhouz',
  },
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

const PortfolioPage = () => {
  return (
    <div>
      <PageHero
        badge="Portfólio"
        title={(
          <>
            Nossos
            {' '}
            <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              projetos
            </span>
          </>
        )}
        subtitle="Conheça alguns dos diversos projetos que desenvolvemos para nossos clientes."
      />

      <PortfolioGrid items={PORTFOLIO} />
    </div>
  );
};

export default PortfolioPage;
