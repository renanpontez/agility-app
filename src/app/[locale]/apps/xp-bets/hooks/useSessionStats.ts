'use client';

import { useMemo } from 'react';

import { simulate } from '../lib/slotMath';
import type { GameState } from '../lib/types';

export type SessionStats = {
  spinsPlayed: number;
  totalWagered: number;
  totalPaidOut: number;
  netResult: number;
  configuredRtp: number;
  realizedRtp: number;
  hitRate: number;
  biggestWin: number;
  longestLossStreak: number;
  withdrawAttempts: number;
  // Hypothetical realized RTP if the user had spun 50,000 times at their
  // settings — used to make the "even at RTP 1.20 you couldn't withdraw"
  // point concrete by showing convergence stats they'd never reach.
  expectedRtpLongRun: number;
};

export const useSessionStats = (state: GameState): SessionStats => {
  const { spinsPlayed, totalWagered, totalPaidOut, history, settings, withdrawAttempts } = state;

  const baseStats = useMemo(() => {
    let biggest = 0;
    let lossStreak = 0;
    let maxLossStreak = 0;
    let hits = 0;
    for (const record of history) {
      if (record.totalPayout > 0) {
        hits += 1;
        lossStreak = 0;
        if (record.totalPayout > biggest) {
          biggest = record.totalPayout;
        }
      } else {
        lossStreak += 1;
        if (lossStreak > maxLossStreak) {
          maxLossStreak = lossStreak;
        }
      }
    }
    const hitRate = history.length === 0 ? 0 : hits / history.length;
    return { biggest, maxLossStreak, hitRate };
  }, [history]);

  const expectedRtpLongRun = useMemo(() => {
    // 50k samples is fast (<300ms in practice) and the result is what makes
    // the reveal screen land — "if you had time, here's what the math says".
    const sim = simulate(50_000, settings, 0x5E55_1234);
    return sim.realizedRtp;
  }, [settings]);

  return {
    spinsPlayed,
    totalWagered,
    totalPaidOut,
    netResult: totalPaidOut - totalWagered,
    configuredRtp: settings.rtp,
    realizedRtp: totalWagered === 0 ? 0 : totalPaidOut / totalWagered,
    hitRate: baseStats.hitRate,
    biggestWin: baseStats.biggest,
    longestLossStreak: baseStats.maxLossStreak,
    withdrawAttempts,
    expectedRtpLongRun,
  };
};
