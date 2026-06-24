import type { WeightVector } from './paytable';
import { baseWeights, PAYING_SYMBOLS, PAYLINES, PAYOUTS, SYMBOLS } from './paytable';
import { makeRng } from './seededRng';
import type {
  GameSettings,
  LineWin,
  Rng,
  SessionMetrics,
  SpinResult,
  SymbolId,
} from './types';

// Pure casino-math engine. User settings come from the on-screen drawer; the
// engine re-balances symbol weights to honor the requested rtp / hitFrequency
// while keeping the volatility shape.
//
// Educational design choice: even when the user sets rtp > 1.0 (mathematically
// "the player wins long-term"), the realized RTP in any 100-spin session can
// land far below the configured value due to variance — and the withdraw
// flow is engineered to never actually release the surplus. The reveal screen
// surfaces both numbers side-by-side to make this concrete.

const sumWeights = (w: WeightVector): number =>
  SYMBOLS.reduce((sum, s) => sum + w[s], 0);

// Expected payout from a single payline, accounting for wild substitution and
// excluding the `bamboo` decorative symbol (which never matches).
const expectedReturnPerLine = (weights: WeightVector): number => {
  const total = sumWeights(weights);
  if (total === 0) {
    return 0;
  }
  let er = 0;
  const pWild = weights.wild / total;
  const pAllWild = pWild ** 3;
  for (const s of PAYING_SYMBOLS) {
    if (s === 'wild') {
      er += pAllWild * PAYOUTS.wild;
      continue;
    }
    const p = (weights[s] + weights.wild) / total;
    er += (p ** 3 - pAllWild) * PAYOUTS[s];
  }
  return er;
};

const totalHitProbability = (weights: WeightVector): number => {
  const total = sumWeights(weights);
  if (total === 0) {
    return 0;
  }
  const pWild = weights.wild / total;
  const pAllWild = pWild ** 3;
  let pHitOnLine = 0;
  for (const s of PAYING_SYMBOLS) {
    if (s === 'wild') {
      pHitOnLine += pAllWild;
      continue;
    }
    const p = (weights[s] + weights.wild) / total;
    pHitOnLine += p ** 3 - pAllWild;
  }
  return 1 - (1 - pHitOnLine) ** PAYLINES.length;
};

/**
 * Re-tunes the symbol weights so EV-per-spin ≈ rtp and hit-probability ≈
 * hitFrequency. We control RTP via the relative weight of high-payout
 * symbols (tiger/gold) and decouple hit-frequency via the decorative
 * `bamboo` weight, which dilutes the match probability across the board
 * without skewing the payout mix.
 *
 * Coordinate descent — alternates two cheap updates per iteration:
 *  1. bamboo nudge to chase hitFrequency (more bamboo = fewer hits)
 *  2. tiger + gold scale to chase RTP (heavier tiger raises RTP fastest)
 *
 * Converges within ~20 iterations for the reachable target range. Outside
 * that range (eg. rtp=1.20 with hitFreq=0.10) it lands as close as it can,
 * which is intentional — the reveal screen surfaces "configured vs. realized"
 * exactly to dramatize this limit.
 */
const weightsKey = (s: GameSettings): string =>
  `${s.rtp}|${s.hitFrequency}|${s.volatility}|${s.wildChance}`;

// LRU-ish cache. The solver is pure of settings, and players keep settings
// stable across many spins — caching turns spin() from O(60 math passes) into
// O(1) after the first call per (rtp, hitFreq, volatility, wildChance) tuple.
const WEIGHT_CACHE = new Map<string, WeightVector>();
const WEIGHT_CACHE_LIMIT = 64;

const solveWeightsImpl = (settings: GameSettings): WeightVector => {
  const weights: WeightVector = baseWeights(settings.volatility);
  weights.wild = Math.max(0.001, settings.wildChance * 30);

  const targetRtp = settings.rtp;
  const targetHit = settings.hitFrequency;
  const lines = PAYLINES.length;

  for (let iter = 0; iter < 60; iter += 1) {
    const evPerLine = expectedReturnPerLine(weights);
    const rtp = evPerLine * lines;
    const hit = totalHitProbability(weights);

    const rtpErr = (targetRtp - rtp) / Math.max(0.1, targetRtp);
    const hitErr = (targetHit - hit) / Math.max(0.1, targetHit);

    if (Math.abs(rtpErr) < 0.015 && Math.abs(hitErr) < 0.02) {
      break;
    }

    // hitFrequency: more bamboo = lower hit rate; less bamboo = higher.
    // Scale geometrically; clamp to a sane range.
    const bambooScale = 1 - hitErr * 0.6;
    const totalNoWild = sumWeights(weights) - weights.wild;
    const targetBamboo = Math.max(0, Math.min(totalNoWild * 6, (weights.bamboo + 4) * bambooScale - 4));
    weights.bamboo = targetBamboo;

    // RTP: heaviest lever is tiger; nudge gold alongside for stability.
    const rtpScale = 1 + rtpErr * 0.35;
    weights.tiger = Math.max(0.02, weights.tiger * rtpScale);
    weights.gold = Math.max(0.2, weights.gold * (1 + rtpErr * 0.15));
  }

  return weights;
};

export const solveWeights = (settings: GameSettings): WeightVector => {
  const key = weightsKey(settings);
  const cached = WEIGHT_CACHE.get(key);
  if (cached) {
    return { ...cached };
  }
  const fresh = solveWeightsImpl(settings);
  if (WEIGHT_CACHE.size >= WEIGHT_CACHE_LIMIT) {
    const firstKey = WEIGHT_CACHE.keys().next().value;
    if (firstKey !== undefined) {
      WEIGHT_CACHE.delete(firstKey);
    }
  }
  WEIGHT_CACHE.set(key, fresh);
  return { ...fresh };
};

const pickSymbol = (weights: WeightVector, rng: Rng): SymbolId => {
  const total = sumWeights(weights);
  const r = rng() * total;
  let acc = 0;
  for (const s of SYMBOLS) {
    acc += weights[s];
    if (r <= acc) {
      return s;
    }
  }
  return SYMBOLS[SYMBOLS.length - 1]!;
};

const buildGrid = (weights: WeightVector, rng: Rng): SymbolId[][] => {
  const grid: SymbolId[][] = [];
  for (let r = 0; r < 3; r += 1) {
    const row: SymbolId[] = [];
    for (let c = 0; c < 3; c += 1) {
      row.push(pickSymbol(weights, rng));
    }
    grid.push(row);
  }
  return grid;
};

// A line "matches" when all 3 cells are either the same non-wild paying
// symbol or wild substitutes. `bamboo` never matches, even as a substitute.
// Three wilds count as the wild jackpot.
const matchedSymbol = (a: SymbolId, b: SymbolId, c: SymbolId): SymbolId | null => {
  const cells = [a, b, c];
  if (cells.includes('bamboo')) {
    return null;
  }
  if (cells.every(s => s === 'wild')) {
    return 'wild';
  }
  const nonWild = cells.filter(s => s !== 'wild');
  if (nonWild.length === 0) {
    return null;
  }
  const first = nonWild[0]!;
  return nonWild.every(s => s === first) ? first : null;
};

const evaluateGrid = (grid: SymbolId[][]): LineWin[] => {
  const wins: LineWin[] = [];
  PAYLINES.forEach((line, lineId) => {
    const symbols = line.map(([r, c]) => grid[r]![c]!);
    const match = matchedSymbol(symbols[0]!, symbols[1]!, symbols[2]!);
    if (match) {
      wins.push({
        lineId,
        symbol: match,
        multiplier: PAYOUTS[match],
        cells: line.map(([r, c]) => [r, c] as [number, number]),
      });
    }
  });
  return wins;
};

/**
 * Run a single spin. Returns the 3x3 grid, any winning paylines, the total
 * payout in chips (multiplier × bet, summed across lines), and whether this
 * is the "jackpot" event (three tigers on any line, or three wilds anywhere).
 */
export const spin = (settings: GameSettings, rng: Rng): SpinResult => {
  const weights = solveWeights(settings);
  const grid = buildGrid(weights, rng);
  const wins = evaluateGrid(grid);
  const totalPayout = wins.reduce(
    (sum, w) => sum + w.multiplier * settings.betPerSpin,
    0,
  );
  const isJackpot = wins.some(w => w.symbol === 'tiger' || w.symbol === 'wild');
  return { grid, wins, totalPayout, isJackpot };
};

/**
 * Deterministic Monte Carlo simulation — used for the educational reveal
 * (calculate "realized RTP" if you spun N times) and for the test suite to
 * verify the math engine honors the settings.
 */
export const simulate = (
  spins: number,
  settings: GameSettings,
  seed: number,
): SessionMetrics => {
  const rng = makeRng(seed);
  let totalWagered = 0;
  let totalPaidOut = 0;
  let hits = 0;
  let biggest = 0;
  let lossStreak = 0;
  let maxLossStreak = 0;
  let jackpots = 0;

  for (let i = 0; i < spins; i += 1) {
    const r = spin(settings, rng);
    totalWagered += settings.betPerSpin;
    totalPaidOut += r.totalPayout;
    if (r.totalPayout > 0) {
      hits += 1;
      lossStreak = 0;
      if (r.totalPayout > biggest) {
        biggest = r.totalPayout;
      }
    } else {
      lossStreak += 1;
      if (lossStreak > maxLossStreak) {
        maxLossStreak = lossStreak;
      }
    }
    if (r.isJackpot) {
      jackpots += 1;
    }
  }

  return {
    spins,
    totalWagered,
    totalPaidOut,
    realizedRtp: totalWagered === 0 ? 0 : totalPaidOut / totalWagered,
    hitRate: spins === 0 ? 0 : hits / spins,
    biggestWin: biggest,
    longestLossStreak: maxLossStreak,
    jackpots,
  };
};

export { PAYLINES, PAYOUTS, SYMBOLS } from './paytable';
export { makeRng } from './seededRng';
