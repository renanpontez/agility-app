'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Synth-based audio — no asset downloads, works offline, sounds passable
// enough for a slot-machine ambiance. AudioContext is created lazily on the
// first user gesture (iOS requirement). Muted by default; HUD toggle flips.

type SoundId = 'spin-stop' | 'win-small' | 'win-big' | 'jackpot' | 'click';

export const useAudio = () => {
  const ctxRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(true);

  const ensureCtx = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    if (ctxRef.current) {
      return ctxRef.current;
    }
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) {
      return null;
    }
    ctxRef.current = new Ctor();
    return ctxRef.current;
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      // Touching the context on the first un-mute satisfies the iOS gesture
      // unlock so subsequent plays don't get suspended.
      if (m) {
        ensureCtx();
      }
      return !m;
    });
  }, [ensureCtx]);

  const play = useCallback(
    (sound: SoundId) => {
      if (muted) {
        return;
      }
      const ctx = ensureCtx();
      if (!ctx) {
        return;
      }
      const now = ctx.currentTime;

      const tone = (freq: number, duration: number, attack = 0.005, type: OscillatorType = 'sine', startGain = 0.18) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(startGain, now + attack);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + duration + 0.05);
      };

      switch (sound) {
        case 'click':
          tone(600, 0.05, 0.001, 'square', 0.1);
          break;
        case 'spin-stop':
          tone(420, 0.1, 0.002, 'triangle', 0.16);
          break;
        case 'win-small':
          tone(660, 0.12, 0.005, 'sine', 0.18);
          tone(880, 0.14, 0.008, 'sine', 0.14);
          break;
        case 'win-big':
          [660, 880, 1100].forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + i * 0.08);
            gain.gain.setValueAtTime(0, now + i * 0.08);
            gain.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.45);
            osc.connect(gain).connect(ctx.destination);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.5);
          });
          break;
        case 'jackpot':
          // Ascending arpeggio
          [523, 659, 784, 988, 1175, 1568].forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now + i * 0.1);
            gain.gain.setValueAtTime(0, now + i * 0.1);
            gain.gain.linearRampToValueAtTime(0.22, now + i * 0.1 + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.6);
            osc.connect(gain).connect(ctx.destination);
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.65);
          });
          break;
        default:
          break;
      }
    },
    [muted, ensureCtx],
  );

  useEffect(
    () => () => {
      ctxRef.current?.close().catch(() => undefined);
    },
    [],
  );

  return { muted, toggleMute, play } as const;
};
