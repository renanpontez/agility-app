'use client';

import type { IconType } from 'react-icons';

import RevealOnScroll from './RevealOnScroll';

export type ServiceCardData = {
  icon: IconType;
  title: string;
  description: string;
  color: string;
};

type ServiceCardProps = {
  service: ServiceCardData;
  delay?: number;
};

const ServiceCard = ({ service, delay = 0 }: ServiceCardProps) => {
  return (
    <RevealOnScroll delay={delay}>
      <div className="group flex h-full flex-col gap-5 rounded-2xl border border-white/5 bg-white/[0.03] p-6 transition-all hover:border-white/10 hover:bg-white/[0.05]">
        <div className={`flex size-12 items-center justify-center rounded-xl ${service.color}`}>
          <service.icon size={24} />
        </div>
        <h3 className="text-lg font-semibold">{service.title}</h3>
        <p className="text-sm leading-relaxed text-white/50">{service.description}</p>
        <span className="mt-auto text-xs font-semibold text-white/30 transition-colors group-hover:text-primary">
          Conhecer mais →
        </span>
      </div>
    </RevealOnScroll>
  );
};

export default ServiceCard;
