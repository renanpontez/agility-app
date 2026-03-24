'use client';

import { useTranslations } from 'next-intl';

export type TechLogo = {
  name: string;
  icon: string;
};

type TechTickerProps = {
  logos?: TechLogo[];
  label?: string;
};

const DEFAULT_LOGOS: TechLogo[] = [
  { name: 'WordPress', icon: '⬡' },
  { name: 'Nuvemshop', icon: '☁' },
  { name: 'React', icon: '⚛' },
  { name: 'Next.js', icon: '▲' },
  { name: 'Shopify', icon: '🛍' },
  { name: 'RD Station', icon: '◈' },
  { name: 'HostGator', icon: '🐊' },
  { name: 'Registro.br', icon: '◉' },
];

const TechTicker = ({
  logos = DEFAULT_LOGOS,
  label,
}: TechTickerProps) => {
  const t = useTranslations('TechTicker');
  const resolvedLabel = label ?? t('label');
  return (
    <section className="py-10">
      <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-white/60">
        {resolvedLabel}
      </p>
      <div
        className="relative overflow-hidden"
        style={{
          mask: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMask: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <div className="flex animate-[scroll_25s_linear_infinite] items-center gap-16 whitespace-nowrap">
          {[...logos, ...logos].map((logo, i) => (
            <div key={i} className="flex shrink-0 items-center gap-2.5 text-white/30 transition-colors hover:text-white/60">
              <span className="text-2xl">{logo.icon}</span>
              <span className="text-sm font-medium">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechTicker;
