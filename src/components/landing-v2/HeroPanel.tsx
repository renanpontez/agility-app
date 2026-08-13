'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';

import CountUp from './motion/CountUp';

const EASE = [0.16, 1, 0.3, 1] as const;

type Metric = {
  label: string;
  to: number;
  suffix?: string;
  decimals?: string; // rendered instead of CountUp when a decimal value is needed
};

/**
 * The glass "studio" console at the heart of the hero — a restrained product
 * surface that signals "we ship polished digital work": live status, three
 * headline metrics that count up, an animated delivery bar, and a drawn
 * performance sparkline. All motion respects reduced-motion.
 */
const HeroPanel = () => {
  const t = useTranslations('Hero');
  const reduce = useReducedMotion();

  const metrics: Metric[] = [
    { label: t('panelMetricPerf'), to: 98 },
    { label: t('panelMetricProjects'), to: 30, suffix: '+' },
    { label: t('panelMetricRating'), to: 5, decimals: '5.0' },
  ];

  return (
    <div className="relative w-full max-w-[420px] overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl">
      {/* Champagne hairline reflection along the top edge */}
      <div
        className="absolute inset-x-6 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, oklch(0.9 0.05 88 / 0.5), transparent)' }}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="ml-2 text-xs font-medium tracking-wide text-white/45">agility · studio</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/60">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
          </span>
          {t('panelStatus')}
        </span>
      </div>

      {/* Metric tiles */}
      <div className="mt-5 grid grid-cols-3 gap-2.5">
        {metrics.map(m => (
          <div key={m.label} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="font-display text-2xl font-semibold leading-none text-white">
              {m.decimals
                ? m.decimals
                : <CountUp to={m.to} suffix={m.suffix} />}
            </div>
            <div className="mt-1.5 text-[10px] font-medium uppercase tracking-wide text-white/40">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Delivery progress */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-white/55">{t('panelProgressLabel')}</span>
          <span className="font-semibold text-white/80">90%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--violet-700), var(--violet-500), var(--violet-300))' }}
            initial={{ width: reduce ? '90%' : '0%' }}
            whileInView={{ width: '90%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}
          />
        </div>
      </div>

      {/* Performance sparkline */}
      <div className="relative mt-5 h-24 w-full">
        <svg viewBox="0 0 340 96" preserveAspectRatio="none" className="size-full">
          <defs>
            <linearGradient id="heroSpark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.62 0.29 309)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="oklch(0.62 0.29 309)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0 74 L42 60 L85 66 L128 44 L170 52 L212 30 L255 38 L297 16 L340 24 L340 96 L0 96 Z"
            fill="url(#heroSpark)"
            initial={{ opacity: reduce ? 1 : 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
          <motion.path
            d="M0 74 L42 60 L85 66 L128 44 L170 52 L212 30 L255 38 L297 16 L340 24"
            fill="none"
            stroke="oklch(0.78 0.19 310)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: reduce ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
          />
        </svg>
      </div>
    </div>
  );
};

export default HeroPanel;
