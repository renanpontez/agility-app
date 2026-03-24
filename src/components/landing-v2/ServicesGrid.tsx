'use client';

import { useTranslations } from 'next-intl';
import { CgWebsite } from 'react-icons/cg';
import { IoCartOutline, IoPhonePortraitOutline } from 'react-icons/io5';
import { TbDeviceAnalytics } from 'react-icons/tb';

import RevealOnScroll from './RevealOnScroll';
import type { ServiceCardData } from './ServiceCard';
import ServiceCard from './ServiceCard';

const ServicesGrid = () => {
  const t = useTranslations('ServicesGrid');

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
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 xl:px-0">
        <RevealOnScroll>
          <div className="mb-14 text-center">
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-primary/70">
              {t('badge')}
            </span>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {t('title')}
              {' '}
              <span className="text-primary">{t('titleHighlight')}</span>
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
