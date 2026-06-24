export type SymbolId
  = | 'tiger'
    | 'gold'
    | 'green'
    | 'blue'
    | 'purple'
    | 'coin'
    | 'wild'
    | 'bamboo';

export type Volatility = 'low' | 'med' | 'high';

export type GameSettings = {
  rtp: number;
  hitFrequency: number;
  volatility: Volatility;
  wildChance: number;
  betPerSpin: 1 | 5 | 10 | 25;
};

export type LineWin = {
  lineId: number;
  symbol: SymbolId;
  multiplier: number;
  cells: [number, number][];
};

export type SpinResult = {
  grid: SymbolId[][];
  wins: LineWin[];
  totalPayout: number;
  isJackpot: boolean;
};

export type Rng = () => number;

export type SessionMetrics = {
  spins: number;
  totalWagered: number;
  totalPaidOut: number;
  realizedRtp: number;
  hitRate: number;
  biggestWin: number;
  longestLossStreak: number;
  jackpots: number;
};

export type Phase
  = | 'intro'
    | 'deposit'
    | 'playing'
    | 'spinning'
    | 'won'
    | 'withdrawing'
    | 'withdrawFail'
    | 'reveal';

export type SpinRecord = {
  betPerSpin: number;
  totalPayout: number;
  isJackpot: boolean;
};

export type GameState = {
  phase: Phase;
  balance: number;
  initialDeposit: number;
  totalWagered: number;
  totalPaidOut: number;
  spinsPlayed: number;
  withdrawAttempts: number;
  settings: GameSettings;
  lastResult: SpinResult | null;
  history: SpinRecord[];
};
