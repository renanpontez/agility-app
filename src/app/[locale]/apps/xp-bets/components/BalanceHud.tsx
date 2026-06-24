'use client';

import { useTranslations } from 'next-intl';

import type { GameState } from '../lib/types';
import DigitCounter from './primitives/DigitCounter';

type Props = {
  state: GameState;
  muted: boolean;
  onToggleMute: () => void;
  onOpenSettings: () => void;
  onWithdraw: () => void;
};

const SoundOnIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

const SoundOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="22" y1="9" x2="16" y2="15" />
    <line x1="16" y1="9" x2="22" y2="15" />
  </svg>
);

export default function BalanceHud({ state, muted, onToggleMute, onOpenSettings, onWithdraw }: Props) {
  const t = useTranslations('xpBets.game');
  return (
    <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3 sm:p-4">
      <div className="flex flex-col gap-1 rounded-2xl bg-stone-900/80 px-4 py-2.5 text-white ring-1 ring-white/10 backdrop-blur">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">{t('balance')}</span>
        <span className="font-mono text-2xl font-bold tabular-nums leading-none">
          R$
          {' '}
          <DigitCounter value={state.balance} />
        </span>
        <div className="mt-1 flex gap-3 text-[10px] text-white/45">
          <span>
            {t('spins')}
            :
            {' '}
            {state.spinsPlayed}
          </span>
          <span>
            {t('totalWagered')}
            :
            {' '}
            R$
            {state.totalWagered}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? t('muteOff') : t('muteOn')}
          className="grid h-9 w-9 place-items-center rounded-full bg-stone-900/80 text-white/70 ring-1 ring-white/10 backdrop-blur transition-colors hover:text-white"
        >
          {muted ? <SoundOffIcon /> : <SoundOnIcon />}
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          className="rounded-full bg-fuchsia-500/15 px-4 py-2 text-[12px] font-semibold text-fuchsia-200 ring-1 ring-fuchsia-400/30 backdrop-blur transition-colors hover:bg-fuchsia-500/25"
        >
          {t('openSettings')}
        </button>
        <button
          type="button"
          onClick={onWithdraw}
          className="rounded-full bg-emerald-500/15 px-4 py-2 text-[12px] font-semibold text-emerald-200 ring-1 ring-emerald-400/30 backdrop-blur transition-colors hover:bg-emerald-500/25"
        >
          {t('withdraw')}
        </button>
      </div>
    </div>
  );
}
