import type { SymbolId, Volatility } from './types';

// Paying symbols are matched on paylines. `bamboo` is decorative — it can
// land on the grid but cannot form a winning line, which is the lever the
// solver uses to dial hit-frequency without dragging RTP with it.
export const SYMBOLS: SymbolId[] = [
  'tiger',
  'gold',
  'green',
  'blue',
  'purple',
  'coin',
  'wild',
  'bamboo',
];

export const PAYING_SYMBOLS: Exclude<SymbolId, 'bamboo'>[] = [
  'tiger',
  'gold',
  'green',
  'blue',
  'purple',
  'coin',
  'wild',
];

// 3-of-a-kind payout multipliers (of the bet). Wild substitutes for any
// regular symbol; three wilds pay a flat amount. Numbers are calibrated
// against the base weight vector so default settings land near 0.96 RTP.
// `bamboo` carries no payout — it's there only to absorb weight share so
// the solver can decouple hit-frequency from RTP.
export const PAYOUTS: Record<SymbolId, number> = {
  tiger: 100,
  gold: 25,
  green: 10,
  blue: 5,
  purple: 2,
  coin: 1,
  wild: 50,
  bamboo: 0,
};

// Five paylines on a 3x3 grid: rows 0/1/2 plus the two diagonals.
export const PAYLINES: ReadonlyArray<ReadonlyArray<[number, number]>> = [
  [[0, 0], [0, 1], [0, 2]],
  [[1, 0], [1, 1], [1, 2]],
  [[2, 0], [2, 1], [2, 2]],
  [[0, 0], [1, 1], [2, 2]],
  [[2, 0], [1, 1], [0, 2]],
];

export type WeightVector = Record<SymbolId, number>;

// Volatility presets bias the base distribution. `bamboo` defaults sit at 0
// — the solver injects bamboo to honor hitFrequency without disturbing RTP.
const BASE_WEIGHTS: Record<Volatility, WeightVector> = {
  med: {
    tiger: 1,
    gold: 4,
    green: 8,
    blue: 12,
    purple: 18,
    coin: 25,
    wild: 2,
    bamboo: 0,
  },
  low: {
    tiger: 0.5,
    gold: 3,
    green: 10,
    blue: 16,
    purple: 22,
    coin: 30,
    wild: 3,
    bamboo: 0,
  },
  high: {
    tiger: 1.6,
    gold: 4,
    green: 6,
    blue: 9,
    purple: 13,
    coin: 22,
    wild: 1.5,
    bamboo: 0,
  },
};

export const baseWeights = (vol: Volatility): WeightVector => ({ ...BASE_WEIGHTS[vol] });
