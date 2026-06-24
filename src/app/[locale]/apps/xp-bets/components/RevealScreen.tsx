'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { useSessionStats } from '../hooks/useSessionStats';
import { track } from '../lib/analytics';
import type { GameState } from '../lib/types';
import PrimaryButton from './primitives/PrimaryButton';

type Props = {
  state: GameState;
  onReplayKeepSettings: () => void;
  onReset: () => void;
};

const fmtMoney = (n: number) =>
  new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(Math.round(n));

const fmtPct = (n: number) => `${(n * 100).toFixed(1)}%`;

const Block = ({ delay, children }: { delay: number; children: React.ReactNode }) => (
  <motion.section
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.section>
);

const Stat = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'good' | 'bad' | 'warn';
}) => {
  const toneClass
    = tone === 'good'
      ? 'text-emerald-300'
      : tone === 'bad'
        ? 'text-rose-300'
        : tone === 'warn' ? 'text-amber-300' : 'text-white';
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">{label}</span>
      <span className={`font-mono text-lg font-bold tabular-nums ${toneClass}`}>{value}</span>
    </div>
  );
};

export default function RevealScreen({ state, onReplayKeepSettings, onReset }: Props) {
  const t = useTranslations('xpBets.reveal');
  const stats = useSessionStats(state);
  const [shareLabel, setShareLabel] = useState<string | null>(null);

  useEffect(() => {
    track('xp_bets_reveal_shown', {
      spins: stats.spinsPlayed,
      configuredRtp: stats.configuredRtp,
      realizedRtp: stats.realizedRtp,
      withdrawAttempts: stats.withdrawAttempts,
    });
    // Mount-only — we want a single tracking event per reveal entry,
    // not a re-fire when computed stats happen to change.
  }, [stats.configuredRtp, stats.realizedRtp, stats.spinsPlayed, stats.withdrawAttempts]);

  const handleShare = async () => {
    const url = typeof window === 'undefined' ? '' : window.location.href;
    const title = t('shareTitle');
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url });
        track('xp_bets_shared', { channel: 'web-share' });
        return;
      } catch {
        // user cancelled; fall through to clipboard
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${title}\n${url}`);
        setShareLabel(t('shareCopied'));
        setTimeout(setShareLabel, 2200, null);
        track('xp_bets_shared', { channel: 'copy' });
      } catch {
        // give up silently
      }
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-gradient-to-b from-rose-950 via-stone-950 to-stone-950 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(225,29,72,0.25),transparent_70%)]" />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col gap-12 px-5 py-16 sm:py-24">
        <Block delay={0}>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            {t('headline')}
          </h1>
          <p className="mt-3 text-lg text-white/70">{t('subhead')}</p>
        </Block>

        <Block delay={0.1}>
          <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300">
            {t('sessionTitle')}
          </h2>
          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 sm:grid-cols-3">
            <Stat label={t('spinsLabel')} value={stats.spinsPlayed.toString()} />
            <Stat label={t('wageredLabel')} value={`R$ ${fmtMoney(stats.totalWagered)}`} />
            <Stat label={t('paidOutLabel')} value={`R$ ${fmtMoney(stats.totalPaidOut)}`} />
            <Stat
              label={t('netLabel')}
              value={`R$ ${fmtMoney(stats.netResult)}`}
              tone={stats.netResult >= 0 ? 'good' : 'bad'}
            />
            <Stat label={t('hitRateLabel')} value={fmtPct(stats.hitRate)} />
            <Stat label={t('biggestWinLabel')} value={`R$ ${fmtMoney(stats.biggestWin)}`} />
            <Stat label={t('lossStreakLabel')} value={String(stats.longestLossStreak)} />
            <Stat
              label={t('withdrawAttemptsLabel')}
              value={String(stats.withdrawAttempts)}
              tone="warn"
            />
          </div>
        </Block>

        <Block delay={0.2}>
          <h2 className="text-xl font-semibold sm:text-2xl">{t('diffTitle')}</h2>
          <p className="mt-3 text-pretty text-[15px] text-white/65">{t('diffBody')}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
            <Stat
              label={t('configuredRtpLabel')}
              value={fmtPct(stats.configuredRtp)}
              tone="warn"
            />
            <Stat
              label={t('realizedRtpLabel')}
              value={fmtPct(stats.realizedRtp)}
              tone={stats.realizedRtp >= stats.configuredRtp ? 'good' : 'bad'}
            />
          </div>
          <div className="mt-3 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
              {t('longRunLabel')}
            </span>
            <span className="mt-2 block font-mono text-3xl font-bold tabular-nums text-amber-300">
              {fmtPct(stats.expectedRtpLongRun)}
            </span>
            <span className="mt-2 block text-[12px] text-white/45">{t('longRunHint')}</span>
          </div>
        </Block>

        <Block delay={0.3}>
          <h2 className="text-xl font-semibold sm:text-2xl">{t('factsTitle')}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[1, 2, 3].map(i => (
              <article
                key={i}
                className="flex flex-col gap-2 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10"
              >
                <span className="font-mono text-2xl font-bold tabular-nums text-amber-300">
                  {t(`fact${i}Number`)}
                </span>
                <p className="text-[13px] leading-snug text-white/75">{t(`fact${i}Body`)}</p>
                <span className="mt-auto text-[11px] text-white/40">{t(`fact${i}Source`)}</span>
              </article>
            ))}
          </div>
        </Block>

        <Block delay={0.4}>
          <div className="flex flex-col gap-3">
            <a
              href="tel:188"
              onClick={() => track('xp_bets_cta_clicked', { target: 'cvv' })}
              className="flex items-center justify-between gap-3 rounded-2xl bg-emerald-500/10 px-5 py-4 ring-1 ring-emerald-400/30 transition-colors hover:bg-emerald-500/15"
            >
              <span className="text-[15px] font-semibold text-emerald-100">{t('ctaCvv')}</span>
              <span className="text-emerald-300">→</span>
            </a>
            <a
              href="https://jogadoresanonimos.com.br"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('xp_bets_cta_clicked', { target: 'ja-brasil' })}
              className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-5 py-4 ring-1 ring-white/10 transition-colors hover:bg-white/10"
            >
              <span className="text-[15px] font-semibold text-white/90">{t('ctaJa')}</span>
              <span className="text-white/50">↗</span>
            </a>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <PrimaryButton onClick={handleShare}>{shareLabel ?? t('ctaShare')}</PrimaryButton>
            <PrimaryButton variant="secondary" onClick={onReplayKeepSettings}>
              {t('ctaReplay')}
            </PrimaryButton>
            <PrimaryButton variant="ghost" onClick={onReset}>
              {t('ctaReset')}
            </PrimaryButton>
          </div>

          <Link
            href="/"
            onClick={() => track('xp_bets_cta_clicked', { target: 'agility' })}
            className="mt-8 inline-block text-[12px] text-white/40 underline-offset-2 hover:text-white/70 hover:underline"
          >
            {t('ctaAgility')}
            {' '}
            →
          </Link>
        </Block>
      </div>
    </div>
  );
}
