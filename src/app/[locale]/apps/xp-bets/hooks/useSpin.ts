'use client';

import { useCallback, useRef } from 'react';

import { randomSeed } from '../lib/seededRng';
import { makeRng, spin } from '../lib/slotMath';
import type { GameSettings, Rng, SpinResult } from '../lib/types';

export type SpinOptions = {
  onResult: (result: SpinResult) => void;
  delayMs?: number;
};

// Encapsulates the "throw the dice" path: kick off a spin, wait the reel
// animation duration, then resolve with the SpinResult. The reducer flips
// phase to 'spinning' on dispatch and back to 'playing' when onResult fires.
export const useSpin = (settings: GameSettings) => {
  const rngRef = useRef<Rng | null>(null);
  if (rngRef.current === null) {
    rngRef.current = makeRng(randomSeed());
  }

  const start = useCallback(
    ({ onResult, delayMs = 1800 }: SpinOptions) => {
      const result = spin(settings, rngRef.current!);
      const t = window.setTimeout(onResult, delayMs, result);
      return () => window.clearTimeout(t);
    },
    [settings],
  );

  return { start } as const;
};
