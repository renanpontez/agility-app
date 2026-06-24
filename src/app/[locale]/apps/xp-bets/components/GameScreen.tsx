'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAudio } from '../hooks/useAudio';
import type { GameAction } from '../hooks/useGameMachine';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useSpin } from '../hooks/useSpin';
import { track } from '../lib/analytics';
import type { GameSettings, GameState, SpinResult } from '../lib/types';
import BalanceHud from './BalanceHud';
import PrimaryButton from './primitives/PrimaryButton';
import SettingsDrawer from './SettingsDrawer';
import WinLineOverlay from './WinLineOverlay';
import WithdrawModal from './WithdrawModal';

// 3D scene is the heaviest chunk — keep it out of the intro bundle.
const SlotMachine3D = dynamic(() => import('./SlotMachine3D'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 grid place-items-center text-white/40">…</div>,
});

const WITHDRAW_FAIL_LIMIT = 3;

type Props = {
  state: GameState;
  dispatch: (action: GameAction) => void;
};

export default function GameScreen({ state, dispatch }: Props) {
  const t = useTranslations('xpBets.game');
  const reducedMotion = usePrefersReducedMotion();
  const { muted, toggleMute, play } = useAudio();
  const { start } = useSpin(state.settings);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawPhase, setWithdrawPhase] = useState<'idle' | 'processing' | 'failed'>('idle');
  const firstSpinFired = useRef(false);

  const isSpinning = state.phase === 'spinning';
  const insufficient = state.balance < state.settings.betPerSpin;

  const lastResult = state.lastResult;

  const onSpin = useCallback(() => {
    if (insufficient || isSpinning) {
      return;
    }
    play('click');
    dispatch({ type: 'SPIN_REQUEST' });
    start({
      delayMs: reducedMotion ? 50 : 1800,
      onResult: (result: SpinResult) => {
        dispatch({ type: 'SPIN_RESULT', payload: result });
      },
    });
  }, [insufficient, isSpinning, play, dispatch, start, reducedMotion]);

  // Side-effects in response to phase changes — sounds + analytics.
  useEffect(() => {
    if (!lastResult || state.phase !== 'playing') {
      return;
    }
    if (!firstSpinFired.current) {
      firstSpinFired.current = true;
      track('xp_bets_first_spin');
    }
    track('xp_bets_spin', { netResult: lastResult.totalPayout, balance: state.balance });
    if (lastResult.isJackpot) {
      play('jackpot');
      track('xp_bets_jackpot');
    } else if (lastResult.totalPayout >= state.settings.betPerSpin * 10) {
      play('win-big');
    } else if (lastResult.totalPayout > 0) {
      play('win-small');
    }
  }, [lastResult, state.phase, state.balance, state.settings.betPerSpin, play]);

  const onWithdraw = useCallback(() => {
    setWithdrawOpen(true);
    setWithdrawPhase('idle');
  }, []);

  const startWithdrawAttempt = useCallback(() => {
    setWithdrawPhase('processing');
    dispatch({ type: 'WITHDRAW_REQUEST' });
    window.setTimeout(() => {
      const nextAttempt = state.withdrawAttempts + 1;
      if (nextAttempt > WITHDRAW_FAIL_LIMIT) {
        track('xp_bets_reveal_shown', {
          spins: state.spinsPlayed,
          configuredRtp: state.settings.rtp,
          withdrawAttempts: nextAttempt,
        });
        setWithdrawOpen(false);
        dispatch({ type: 'REVEAL' });
      } else {
        dispatch({ type: 'WITHDRAW_FAIL' });
        setWithdrawPhase('failed');
      }
    }, 1400);
  }, [dispatch, state.withdrawAttempts, state.spinsPlayed, state.settings.rtp]);

  const handleSettingsChange = useCallback(
    (patch: Partial<GameSettings>) => {
      dispatch({ type: 'SETTINGS_CHANGE', payload: patch });
    },
    [dispatch],
  );

  const handleMuteToggle = useCallback(() => {
    if (muted) {
      track('xp_bets_audio_unmuted');
    }
    toggleMute();
  }, [muted, toggleMute]);

  const wins = useMemo(() => lastResult?.wins ?? [], [lastResult]);

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-gradient-to-b from-stone-950 via-stone-900 to-rose-950 text-white">
      <BalanceHud
        state={state}
        muted={muted}
        onToggleMute={handleMuteToggle}
        onOpenSettings={() => setSettingsOpen(true)}
        onWithdraw={onWithdraw}
      />

      <div className="relative flex-1">
        <SlotMachine3D
          result={lastResult}
          isSpinning={isSpinning}
          reducedMotion={reducedMotion}
        />
        <WinLineOverlay wins={isSpinning ? [] : wins} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3 px-4 pb-8 pt-2 sm:pb-10">
        <div className="text-[11px] uppercase tracking-[0.2em] text-white/40">
          {t('bet')}
          {' '}
          ·
          {' '}
          R$
          {' '}
          {state.settings.betPerSpin}
        </div>
        <PrimaryButton size="lg" onClick={onSpin} disabled={insufficient || isSpinning} className="min-w-[160px]">
          {insufficient ? t('noBalance') : isSpinning ? t('spinning') : t('spin')}
        </PrimaryButton>
        {insufficient && !isSpinning && (
          <button
            type="button"
            onClick={onWithdraw}
            className="text-[12px] font-medium text-amber-300 underline underline-offset-2 hover:text-amber-200"
          >
            {t('withdraw')}
            {' '}
            →
          </button>
        )}
      </div>

      <SettingsDrawer
        open={settingsOpen}
        settings={state.settings}
        onChange={handleSettingsChange}
        onClose={() => setSettingsOpen(false)}
      />

      <WithdrawModal
        open={withdrawOpen}
        phase={withdrawPhase}
        attempts={state.withdrawAttempts}
        balance={state.balance}
        onRequest={startWithdrawAttempt}
        onRetry={startWithdrawAttempt}
        onGiveUp={() => {
          setWithdrawOpen(false);
          dispatch({ type: 'REVEAL' });
          track('xp_bets_reveal_shown', {
            spins: state.spinsPlayed,
            configuredRtp: state.settings.rtp,
            withdrawAttempts: state.withdrawAttempts,
            reason: 'give-up',
          });
        }}
        onClose={() => {
          setWithdrawOpen(false);
          setWithdrawPhase('idle');
          dispatch({ type: 'BACK_TO_PLAYING' });
        }}
      />
    </div>
  );
}
