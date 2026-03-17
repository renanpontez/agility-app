'use client';

import { CgWebsite } from 'react-icons/cg';
import { IoCartOutline, IoPhonePortraitOutline } from 'react-icons/io5';
import { TbDeviceAnalytics } from 'react-icons/tb';

import RevealOnScroll from './RevealOnScroll';
import type { ServiceCardData } from './ServiceCard';
import ServiceCard from './ServiceCard';

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

const ServicesGrid = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 xl:px-0">
        <RevealOnScroll>
          <div className="mb-14 text-center">
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-primary/70">
              Nossos serviços
            </span>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Serviços com a qualidade
              {' '}
              <span className="text-primary">Agility</span>
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
