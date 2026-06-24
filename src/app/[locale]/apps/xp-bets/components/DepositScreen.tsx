'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { track } from '../lib/analytics';
import DigitCounter from './primitives/DigitCounter';
import PrimaryButton from './primitives/PrimaryButton';

type Props = {
  onDone: () => void;
};

const TARGET_AMOUNT = 1000;
const COUNTUP_DURATION_MS = 1600;

export default function DepositScreen({ onDone }: Props) {
  const t = useTranslations('xpBets.deposit');
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / COUNTUP_DURATION_MS);
      const eased = 1 - (1 - p) ** 3;
      setShown(Math.round(TARGET_AMOUNT * eased));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDone(true);
        track('xp_bets_deposit_done');
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-stone-950 px-6 py-16 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(245,158,11,0.12),transparent_70%)]" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">{t('title')}</h2>
        <p className="text-pretty text-sm text-white/55">{t('subtitle')}</p>

        <div className="flex flex-col items-center gap-2 rounded-2xl bg-gradient-to-b from-amber-400/10 to-amber-400/0 px-10 py-8 ring-1 ring-amber-400/30">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-amber-300">
            {t('amountLabel')}
          </span>
          <span className="font-mono text-5xl font-bold tabular-nums text-white">
            R$
            {' '}
            <DigitCounter value={shown} durationSec={0} />
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: done ? 1 : 0, y: done ? 0 : 12 }}
          transition={{ duration: 0.4 }}
        >
          <PrimaryButton size="lg" onClick={onDone} disabled={!done}>
            {t('continueCta')}
          </PrimaryButton>
        </motion.div>
      </div>
    </div>
  );
}
