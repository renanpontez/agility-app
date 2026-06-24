'use client';

import { useCallback } from 'react';

import DepositScreen from './components/DepositScreen';
import GameScreen from './components/GameScreen';
import IntroScreen from './components/IntroScreen';
import RevealScreen from './components/RevealScreen';
import { useGameMachine } from './hooks/useGameMachine';
import { track } from './lib/analytics';

export default function XpBetsExperience() {
  const { state, dispatch } = useGameMachine();

  const handleStart = useCallback(() => {
    track('xp_bets_started');
    dispatch({ type: 'START' });
  }, [dispatch]);

  const handleDepositDone = useCallback(() => {
    dispatch({ type: 'DEPOSIT_DONE' });
  }, [dispatch]);

  const handleReplay = useCallback(() => {
    track('xp_bets_replay', { mode: 'keep-settings' });
    dispatch({ type: 'REPLAY_KEEP_SETTINGS' });
  }, [dispatch]);

  const handleReset = useCallback(() => {
    track('xp_bets_replay', { mode: 'full-reset' });
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  switch (state.phase) {
    case 'intro':
      return <IntroScreen onStart={handleStart} />;
    case 'deposit':
      return <DepositScreen onDone={handleDepositDone} />;
    case 'reveal':
      return (
        <RevealScreen
          state={state}
          onReplayKeepSettings={handleReplay}
          onReset={handleReset}
        />
      );
    case 'playing':
    case 'spinning':
    case 'won':
    case 'withdrawing':
    case 'withdrawFail':
      return <GameScreen state={state} dispatch={dispatch} />;
    default:
      return <IntroScreen onStart={handleStart} />;
  }
}
