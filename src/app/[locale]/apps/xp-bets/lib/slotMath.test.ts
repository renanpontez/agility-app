import { describe, expect, it } from 'vitest';

import { makeRng } from './seededRng';
import { simulate, spin } from './slotMath';
import type { GameSettings } from './types';

const profile = (overrides: Partial<GameSettings> = {}): GameSettings => ({
  rtp: 0.96,
  hitFrequency: 0.3,
  volatility: 'med',
  wildChance: 0.04,
  betPerSpin: 5,
  ...overrides,
});

describe('slotMath', () => {
  it('produces deterministic spins for a given seed', () => {
    const settings = profile();
    const a = simulate(500, settings, 42);
    const b = simulate(500, settings, 42);
    expect(a).toEqual(b);
  });

  it('produces different spins for different seeds', () => {
    const settings = profile();
    const a = simulate(500, settings, 1);
    const b = simulate(500, settings, 2);
    expect(a.totalPaidOut).not.toEqual(b.totalPaidOut);
  });

  it('produces a 3x3 grid on every spin', () => {
    const rng = makeRng(7);
    const r = spin(profile(), rng);
    expect(r.grid).toHaveLength(3);
    for (const row of r.grid) {
      expect(row).toHaveLength(3);
    }
  });

  it('converges close to the configured RTP for the default profile', { timeout: 30000 }, () => {
    // 20k spins keeps the test under a second; tolerance is generous because
    // even at 20k variance is real. The shipped settings panel uses the same
    // solver — this is the smoke test that proves it's not wildly off.
    const m = simulate(20_000, profile({ rtp: 0.96 }), 1234);
    expect(m.realizedRtp).toBeGreaterThan(0.85);
    expect(m.realizedRtp).toBeLessThan(1.1);
  });

  it('honors a higher configured RTP directionally', { timeout: 30000 }, () => {
    const low = simulate(20_000, profile({ rtp: 0.70 }), 99);
    const high = simulate(20_000, profile({ rtp: 1.15 }), 99);
    expect(high.realizedRtp).toBeGreaterThan(low.realizedRtp);
  });

  it('honors a higher hit frequency directionally', { timeout: 30000 }, () => {
    const sparse = simulate(20_000, profile({ hitFrequency: 0.15 }), 555);
    const dense = simulate(20_000, profile({ hitFrequency: 0.50 }), 555);
    expect(dense.hitRate).toBeGreaterThan(sparse.hitRate);
  });
});
