'use client';

import { useCallback, useReducer } from 'react';

import type {
  GameSettings,
  GameState,
  SpinResult,
} from '../lib/types';

const INITIAL_DEPOSIT = 1000;

const DEFAULT_SETTINGS: GameSettings = {
  rtp: 0.96,
  hitFrequency: 0.3,
  volatility: 'med',
  wildChance: 0.04,
  betPerSpin: 5,
};

export const initialState = (): GameState => ({
  phase: 'intro',
  balance: 0,
  initialDeposit: 0,
  totalWagered: 0,
  totalPaidOut: 0,
  spinsPlayed: 0,
  withdrawAttempts: 0,
  settings: { ...DEFAULT_SETTINGS },
  lastResult: null,
  history: [],
});

export type GameAction
  = | { type: 'START' }
    | { type: 'DEPOSIT_DONE' }
    | { type: 'SPIN_REQUEST' }
    | { type: 'SPIN_RESULT'; payload: SpinResult }
    | { type: 'SETTINGS_CHANGE'; payload: Partial<GameSettings> }
    | { type: 'WITHDRAW_REQUEST' }
    | { type: 'WITHDRAW_FAIL' }
    | { type: 'REVEAL' }
    | { type: 'BACK_TO_PLAYING' }
    | { type: 'RESET' }
    | { type: 'REPLAY_KEEP_SETTINGS' };

const reducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START':
      return {
        ...state,
        phase: 'deposit',
      };
    case 'DEPOSIT_DONE':
      return {
        ...state,
        phase: 'playing',
        balance: INITIAL_DEPOSIT,
        initialDeposit: INITIAL_DEPOSIT,
      };
    case 'SPIN_REQUEST':
      if (state.balance < state.settings.betPerSpin) {
        return state;
      }
      return {
        ...state,
        phase: 'spinning',
        balance: state.balance - state.settings.betPerSpin,
        totalWagered: state.totalWagered + state.settings.betPerSpin,
      };
    case 'SPIN_RESULT': {
      const result = action.payload;
      return {
        ...state,
        phase: 'playing',
        balance: state.balance + result.totalPayout,
        totalPaidOut: state.totalPaidOut + result.totalPayout,
        spinsPlayed: state.spinsPlayed + 1,
        lastResult: result,
        history: [
          ...state.history,
          {
            betPerSpin: state.settings.betPerSpin,
            totalPayout: result.totalPayout,
            isJackpot: result.isJackpot,
          },
        ].slice(-500),
      };
    }
    case 'SETTINGS_CHANGE':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case 'WITHDRAW_REQUEST':
      return { ...state, phase: 'withdrawing' };
    case 'WITHDRAW_FAIL':
      return {
        ...state,
        phase: 'withdrawFail',
        withdrawAttempts: state.withdrawAttempts + 1,
      };
    case 'BACK_TO_PLAYING':
      return { ...state, phase: 'playing' };
    case 'REVEAL':
      return { ...state, phase: 'reveal' };
    case 'REPLAY_KEEP_SETTINGS':
      return {
        ...initialState(),
        phase: 'deposit',
        settings: { ...state.settings },
      };
    case 'RESET':
      return initialState();
    default:
      return state;
  }
};

export const useGameMachine = () => {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const safeDispatch = useCallback(
    (action: GameAction) => dispatch(action),
    [],
  );

  return { state, dispatch: safeDispatch } as const;
};
