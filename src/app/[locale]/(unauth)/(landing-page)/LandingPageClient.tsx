'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { CgWebsite } from 'react-icons/cg';
import { FaWhatsapp } from 'react-icons/fa';
import { IoCartOutline, IoPhonePortraitOutline } from 'react-icons/io5';
import { TbDeviceAnalytics } from 'react-icons/tb';

import type { FaqItem, PortfolioItem, ServiceCardData } from '@/components/landing-v2';
import {
  PortfolioCard,
  RevealOnScroll,
  ServiceCard,
  TechTicker,
  V2Hero,
} from '@/components/landing-v2';

const ScrollBanner = dynamic(() => import('@/components/landing-v2/ScrollBanner'));
const FaqAccordion = dynamic(() => import('@/components/landing-v2/FaqAccordion'));
const ContactSection = dynamic(() => import('@/components/landing-v2/ContactSection'));

/* ───────────────────────────── DATA ───────────────────────────── */

const PORTFOLIO_FILTERS = ['Todos', 'Site', 'Landing Page', 'App', 'Design'] as const;

/* ───────────────────────────── PAGE ───────────────────────────── */

const LandingPage = () => {
  const t = useTranslations('HomePage');
  const [activeFilter, setActiveFilter] = useState<string>('Todos');

  const filterLabels: Record<string, string> = {
    'Todos': t('filterAll'),
    'Site': t('filterSite'),
    'Landing Page': t('filterLanding'),
    'App': t('filterApp'),
    'Design': t('filterDesign'),
  };

  const SERVICES: ServiceCardData[] = [
    {
      icon: CgWebsite,
      title: t('service1_title'),
      description: t('service1_description'),
      color: 'bg-blue-500/10 text-blue-400',
    },
    {
      icon: IoPhonePortraitOutline,
      title: t('service2_title'),
      description: t('service2_description'),
      color: 'bg-green-500/10 text-green-400',
    },
    {
      icon: IoCartOutline,
      title: t('service3_title'),
      description: t('service3_description'),
      color: 'bg-amber-500/10 text-amber-400',
    },
    {
      icon: TbDeviceAnalytics,
      title: t('service4_title'),
      description: t('service4_description'),
      color: 'bg-purple-500/10 text-purple-400',
    },
  ];

  const PORTFOLIO: PortfolioItem[] = [
    {
      name: 'Dra. Barbarela Freire',
      category: t('portfolio_dra_category'),
      type: 'Site',
      description: t('portfolio_dra_description'),
      image: '/assets/images/portfolio/dra-barbarela-freire/thumbnail.png',
      slug: 'dra-barbarela-freire',
    },
    {
      name: 'MR Advogados',
      category: t('portfolio_mr_category'),
      type: 'Site',
      description: t('portfolio_mr_description'),
      image: '/assets/images/portfolio/mr-advogados/thumbnail.webp',
      slug: 'mr-advogados',
    },
    {
      name: 'EasyToLive',
      category: t('portfolio_easy_category'),
      type: 'App',
      description: t('portfolio_easy_description'),
      image: '/assets/images/portfolio/easytolive_cover.webp',
      slug: 'easytolive',
    },
    {
      name: 'Academia Cearense de Economia',
      category: t('portfolio_academia_category'),
      type: 'Site',
      description: t('portfolio_academia_description'),
      image: '/assets/images/portfolio/academia_cover.webp',
      slug: 'academia-cearense-de-economia',
    },
    {
      name: 'Agillock',
      category: t('portfolio_agillock_category'),
      type: 'Landing Page',
      description: t('portfolio_agillock_description'),
      image: '/assets/images/portfolio/agillock_cover.webp',
      slug: 'agillock',
    },
    {
      name: 'Agility',
      category: t('portfolio_agility_category'),
      type: 'Design',
      description: t('portfolio_agility_description'),
      image: '/assets/images/portfolio/agility/thumbnail.webp',
      slug: 'agility',
    },
    {
      name: 'Dynotest',
      category: t('portfolio_dynotest_category'),
      type: 'Site',
      description: t('portfolio_dynotest_description'),
      image: '/assets/images/portfolio/dynotest_cover.webp',
      slug: 'dynotest',
    },
  ];

  const FAQ: FaqItem[] = [
    {
      q: t('faq1_q'),
      a: t('faq1_a'),
    },
    {
      q: t('faq2_q'),
      a: t('faq2_a'),
    },
    {
      q: t('faq3_q'),
      a: t('faq3_a'),
    },
    {
      q: t('faq4_q'),
      a: t('faq4_a'),
    },
  ];

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
                  <span className="mt-1 text-sm text-white/40">{t('projectsDelivered')}</span>
                </div>
                <div className="relative row-span-2 overflow-hidden rounded-2xl">
                  <Image src="/assets/images/about-us-img.svg" alt={t('aboutImgAlt')} fill className="object-cover" />
                </div>
                <div className="relative overflow-hidden rounded-2xl">
                  <Image src="/assets/images/agility-team-working.jpeg" alt={t('aboutWorkAlt')} fill className="object-cover" />
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={150} className="flex flex-1 flex-col justify-center gap-6">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary/70">
                {t('aboutBadge')}
              </span>
              <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                {t('aboutTitle')}
              </h2>
              <p className="text-lg leading-relaxed text-white/60">
                {t('aboutP1')}
              </p>
              <p className="text-lg leading-relaxed text-white/60">
                {t('aboutP2')}
              </p>
              <a
                href="#Contato"
                className="mt-2 w-fit rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium text-white/80 transition-all hover:border-primary/40 hover:text-primary"
              >
                {t('aboutCta')}
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
                {t('servicesBadge')}
              </span>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {t('servicesTitle', {
                  highlight: '',
                }).split('').length > 0 && (
                  <>
                    {t('servicesTitle', { highlight: '|||' }).split('|||')[0]}
                    <span className="text-primary">{t('servicesTitleHighlight')}</span>
                    {t('servicesTitle', { highlight: '|||' }).split('|||')[1]}
                  </>
                )}
              </h2>
              <p className="mx-auto mt-4 max-w-md text-white/50">
                {t('servicesDescription')}
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
                {t('portfolioBadge')}
              </span>
              <h2 className="max-w-md text-2xl font-bold tracking-tight md:text-4xl">
                {t('portfolioTitle', { highlight: '|||' }).split('|||')[0]}
                <span className="text-primary">{t('portfolioTitleHighlight')}</span>
                {t('portfolioTitle', { highlight: '|||' }).split('|||')[1]}
              </h2>
              <p className="mx-auto mt-4 max-w-md text-white/50">
                {t('portfolioDescription')}
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
                  {filterLabels[filter]}
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
                {t('ctaTitle', { highlight1: '|||1', highlight2: '|||2' }).split('|||1')[0]}
                <span className="text-primary">{t('ctaHighlight1')}</span>
                {t('ctaTitle', { highlight1: '|||1', highlight2: '|||2' }).split('|||1')[1]?.split('|||2')[0]}
                <span className="text-primary">{t('ctaHighlight2')}</span>
                {t('ctaTitle', { highlight1: '|||1', highlight2: '|||2' }).split('|||2')[1]}
              </h2>
              <p className="mb-8 text-lg text-white/60">
                {t('ctaDescription')}
              </p>
              <a
                href="#Contato"
                className="inline-flex rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
              >
                {t('ctaButton')}
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
                {t('faqBadge')}
              </span>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {t('faqTitle')}
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
              {t('finalCtaTitle')}
            </h2>
            <p className="mx-auto mb-10 max-w-lg text-lg text-white/70">
              {t('finalCtaDescription')}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#Contato"
                className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-primary transition-all hover:bg-white/90 hover:shadow-lg"
              >
                {t('finalCtaButton')}
              </a>
              <a
                href="https://wa.me/+5585996284730"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/20"
              >
                <FaWhatsapp size={16} />
                {t('finalCtaWhatsapp')}
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {[t('finalCtaPill1'), t('finalCtaPill2'), t('finalCtaPill3')].map(item => (
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
