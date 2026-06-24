import type { Rng } from './types';

// Mulberry32 — small, fast, good-enough PRNG with a 32-bit seed.
// Deterministic: same seed => same sequence. Used for repeatable simulations
// and tests; production spins also seed with Date.now() ^ random for variety.
export const makeRng = (seed: number): Rng => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const randomSeed = (): number =>
  (Date.now() ^ Math.floor(Math.random() * 0xFFFFFFFF)) >>> 0;
