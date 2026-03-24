'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { CgWebsite } from 'react-icons/cg';
import { IoCartOutline } from 'react-icons/io5';
import { TbDeviceAnalytics } from 'react-icons/tb';

import MouseParallax from './MouseParallax';

type HeroPill = string;

type HeroCard = {
  icon: ReactNode;
  iconBg: string;
  label: string;
};

type HeroCta = {
  label: string;
  href: string;
  variant: 'primary' | 'outline';
};

type V2HeroProps = {
  title?: ReactNode;
  highlight?: string;
  subtitle?: string;
  cta1?: HeroCta;
  cta2?: HeroCta;
  pills?: HeroPill[];
  cards?: HeroCard[];
};

const V2Hero = ({
  title,
  highlight,
  subtitle,
  cta1,
  cta2,
  pills,
  cards,
}: V2HeroProps) => {
  const t = useTranslations('Hero');

  const resolvedCards = cards ?? [
    {
      icon: <CgWebsite className="size-full text-primary" />,
      iconBg: 'bg-primary/20',
      label: t('card1'),
    },
    {
      icon: <IoCartOutline className="size-full text-green-400" />,
      iconBg: 'bg-green-500/20',
      label: t('card2'),
    },
    {
      icon: <TbDeviceAnalytics className="size-full text-amber-400" />,
      iconBg: 'bg-amber-500/20',
      label: t('card3'),
    },
  ];

  const resolvedCta1 = cta1 ?? { label: t('cta1'), href: '#Contato', variant: 'primary' as const };
  const resolvedCta2 = cta2 ?? { label: t('cta2'), href: '#Servicos', variant: 'outline' as const };
  const resolvedPills = pills ?? [t('pill1'), t('pill2'), t('pill3')];
  const resolvedHighlight = highlight ?? t('highlight');
  const resolvedSubtitle = subtitle ?? t('subtitle');
  return (
    <section id="Home" className="relative overflow-hidden px-4 pb-10 pt-24 sm:px-6 lg:flex lg:min-h-screen lg:items-center lg:pb-0 lg:pt-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-8">
          <div className="order-2 flex-1 text-center lg:order-1 lg:text-left">
            <h1 className="mb-4 max-w-md text-3xl font-bold leading-[1.1] tracking-tight sm:mb-6 sm:text-4xl lg:text-5xl">
              {title || (
                <>
                  {t('titlePrefix')}
                  {' '}
                  <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {resolvedHighlight}
                  </span>
                </>
              )}
            </h1>

            <p className="mx-auto mb-6 max-w-md text-base leading-relaxed text-white/50 sm:mb-8 sm:text-lg lg:mx-0">
              {resolvedSubtitle}
            </p>

            <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 md:justify-start">
              <a
                href={resolvedCta1.href}
                className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all hover:bg-white/90 hover:shadow-lg"
              >
                {resolvedCta1.label}
              </a>
              <a
                href={resolvedCta2.href}
                className="rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium text-white/80 transition-all hover:border-white/40 hover:text-white"
              >
                {resolvedCta2.label}
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-1 border-t border-white/10 pt-8 sm:mt-10 sm:gap-2 md:border-transparent md:pt-0 lg:justify-start">
              {resolvedPills.map(pill => (
                <span
                  key={pill}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-white/50"
                >
                  <svg className="size-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <div className="relative order-1 flex w-full items-center justify-center lg:order-2 lg:flex-1">
            <div className="relative h-[260px] w-full max-w-[320px] sm:aspect-square sm:h-auto sm:max-w-md">
              {resolvedCards[0] && (
                <MouseParallax intensity={1.8} floatDuration={7} floatDelay={0} className="absolute left-2 top-2 sm:left-8 sm:top-12">
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 backdrop-blur-sm sm:p-4">
                    <div className="flex items-center gap-2">
                      <div className={`size-6 rounded-lg ${resolvedCards[0].iconBg} p-1 sm:size-8 sm:p-1.5`}>
                        {resolvedCards[0].icon}
                      </div>
                      <span className="text-[11px] font-medium sm:text-xs">{resolvedCards[0].label}</span>
                    </div>
                  </div>
                </MouseParallax>
              )}

              {resolvedCards[1] && (
                <MouseParallax intensity={1.2} floatDuration={8} floatDelay={0.5} className="absolute right-2 top-12 sm:right-2 sm:top-32">
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 backdrop-blur-sm sm:p-4">
                    <div className="flex items-center gap-2">
                      <div className={`size-6 rounded-lg ${resolvedCards[1].iconBg} p-1 sm:size-8 sm:p-1.5`}>
                        {resolvedCards[1].icon}
                      </div>
                      <span className="text-[11px] font-medium sm:text-xs">{resolvedCards[1].label}</span>
                    </div>
                  </div>
                </MouseParallax>
              )}

              {resolvedCards[2] && (
                <MouseParallax intensity={2} floatDuration={9} floatDelay={1} className="absolute bottom-12 left-2 sm:bottom-32 sm:left-4">
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 backdrop-blur-sm sm:p-4">
                    <div className="flex items-center gap-2">
                      <div className={`size-6 rounded-lg ${resolvedCards[2].iconBg} p-1 sm:size-8 sm:p-1.5`}>
                        {resolvedCards[2].icon}
                      </div>
                      <span className="text-[11px] font-medium sm:text-xs">{resolvedCards[2].label}</span>
                    </div>
                  </div>
                </MouseParallax>
              )}

              <MouseParallax intensity={1.5} floatDuration={7.5} floatDelay={1.5} className="absolute bottom-2 right-4 sm:bottom-12 sm:right-12">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 backdrop-blur-sm sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex -space-x-2">
                      <div className="size-5 rounded-full border-2 border-[#050505] bg-primary/60 sm:size-7" />
                      <div className="size-5 rounded-full border-2 border-[#050505] bg-purple-400/60 sm:size-7" />
                      <div className="size-5 rounded-full border-2 border-[#050505] bg-pink-400/60 sm:size-7" />
                    </div>
                    <span className="text-[11px] font-medium text-white/70 sm:text-xs">{t('projectsCount')}</span>
                  </div>
                </div>
              </MouseParallax>

              <MouseParallax intensity={0.3} floatDuration={10} floatDelay={0} className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center justify-center">
                  <Image src="/assets/images/logo/logo_symbol_primary.svg" alt="Agility" width={40} height={40} className="sm:size-14" />
                </div>
              </MouseParallax>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default V2Hero;
