'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { track } from '../lib/analytics';
import PrimaryButton from './primitives/PrimaryButton';

type Props = {
  onStart: () => void;
};

export default function IntroScreen({ onStart }: Props) {
  const t = useTranslations('xpBets.intro');

  useEffect(() => {
    track('xp_bets_intro_view');
  }, []);

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-stone-950 via-stone-900 to-rose-950 px-5 py-12 text-white">
      <BackgroundDecor />
      <div className="relative z-10 flex w-full max-w-xl flex-col gap-7">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="self-start rounded-full bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300 ring-1 ring-amber-400/30"
        >
          {t('eyebrow')}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl"
        >
          {t('title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="text-pretty text-lg text-white/75"
        >
          {t('lead')}
        </motion.p>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-2 text-[15px] text-white/65"
        >
          {[t('bullet1'), t('bullet2'), t('bullet3')].map((line, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-[6px] block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/80" />
              <span>{line}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="mt-2 flex flex-col items-start gap-3"
        >
          <PrimaryButton size="lg" onClick={onStart}>
            {t('cta')}
          </PrimaryButton>
          <span className="text-[12px] text-white/40">{t('ctaHint')}</span>
        </motion.div>
      </div>
    </div>
  );
}

function BackgroundDecor() {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-64 bg-[radial-gradient(60%_70%_at_50%_0%,rgba(245,158,11,0.18),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-32 left-1/2 -z-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-rose-700/25 blur-3xl" />
    </>
  );
}
