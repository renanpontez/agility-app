'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { track } from '../lib/analytics';
import type { GameSettings, Volatility } from '../lib/types';
import PrimaryButton from './primitives/PrimaryButton';
import Slider from './primitives/Slider';

type Props = {
  open: boolean;
  settings: GameSettings;
  onChange: (patch: Partial<GameSettings>) => void;
  onClose: () => void;
};

const DEFAULTS: GameSettings = {
  rtp: 0.96,
  hitFrequency: 0.3,
  volatility: 'med',
  wildChance: 0.04,
  betPerSpin: 5,
};

const BET_OPTIONS: GameSettings['betPerSpin'][] = [1, 5, 10, 25];

// Tiny debounce of analytics events — sliders fire continuously and we
// don't want the dashboard spammed.
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const trackChange = (field: keyof GameSettings, value: GameSettings[keyof GameSettings]) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    track('xp_bets_settings_changed', { field, value: String(value) });
  }, 500);
};

export default function SettingsDrawer({ open, settings, onChange, onClose }: Props) {
  const t = useTranslations('xpBets.settings');

  useEffect(() => {
    if (!open) {
      return;
    }
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const set = <K extends keyof GameSettings>(field: K, value: GameSettings[K]) => {
    onChange({ [field]: value } as Partial<GameSettings>);
    trackChange(field, value);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={t('title')}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="fixed inset-x-0 bottom-0 z-40 max-h-[90dvh] overflow-y-auto rounded-t-3xl bg-stone-950 px-5 pb-8 pt-5 text-white ring-1 ring-white/10 sm:mx-auto sm:max-w-2xl sm:rounded-t-[28px]"
          >
            <div className="sticky top-0 -mx-5 mb-3 flex items-center justify-between border-b border-white/5 bg-stone-950/95 px-5 py-3 backdrop-blur">
              <div>
                <h3 className="text-base font-semibold">{t('title')}</h3>
                <p className="mt-0.5 text-[12px] text-white/55">{t('subtitle')}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-white/10 px-3 py-1 text-[12px] text-white/80 hover:bg-white/15"
                aria-label={t('close')}
              >
                {t('close')}
              </button>
            </div>

            <div className="flex flex-col gap-6 py-2">
              <Slider
                label={t('rtp')}
                hint={t('rtpHint')}
                min={0.5}
                max={1.2}
                step={0.01}
                value={settings.rtp}
                aria-valuetext={`${Math.round(settings.rtp * 100)} porcento`}
                onChange={e => set('rtp', Number(e.target.value))}
                valueLabel={`${(settings.rtp * 100).toFixed(0)}%`}
              />
              <Slider
                label={t('hitFrequency')}
                hint={t('hitFrequencyHint')}
                min={0.1}
                max={0.6}
                step={0.05}
                value={settings.hitFrequency}
                onChange={e => set('hitFrequency', Number(e.target.value))}
                valueLabel={`${(settings.hitFrequency * 100).toFixed(0)}%`}
              />

              <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] font-medium text-white/85">{t('volatility')}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'med', 'high'] as Volatility[]).map((v) => {
                    const labelKey
                      = v === 'low'
                        ? 'volatilityLow'
                        : v === 'med' ? 'volatilityMed' : 'volatilityHigh';
                    const active = settings.volatility === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => set('volatility', v)}
                        className={`rounded-xl px-3 py-2 text-[13px] font-semibold transition-colors ${
                          active
                            ? 'bg-amber-400 text-stone-900'
                            : 'bg-white/5 text-white/70 ring-1 ring-white/10 hover:bg-white/10'
                        }`}
                      >
                        {t(labelKey)}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[11.5px] leading-snug text-white/45">{t('volatilityHint')}</span>
              </div>

              <Slider
                label={t('wildChance')}
                hint={t('wildChanceHint')}
                min={0}
                max={0.15}
                step={0.01}
                value={settings.wildChance}
                onChange={e => set('wildChance', Number(e.target.value))}
                valueLabel={`${(settings.wildChance * 100).toFixed(0)}%`}
              />

              <div className="flex flex-col gap-2">
                <span className="text-[13px] font-medium text-white/85">{t('betPerSpin')}</span>
                <div className="grid grid-cols-4 gap-2">
                  {BET_OPTIONS.map((b) => {
                    const active = settings.betPerSpin === b;
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => set('betPerSpin', b)}
                        className={`rounded-xl px-2 py-2 font-mono text-[13px] font-semibold transition-colors ${
                          active
                            ? 'bg-amber-400 text-stone-900'
                            : 'bg-white/5 text-white/70 ring-1 ring-white/10 hover:bg-white/10'
                        }`}
                      >
                        R$
                        {' '}
                        {b}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onChange(DEFAULTS)}
                  className="text-[12px] font-medium text-white/55 underline-offset-2 hover:text-white/80 hover:underline"
                >
                  {t('reset')}
                </button>
                <PrimaryButton size="sm" variant="secondary" onClick={onClose}>
                  {t('close')}
                </PrimaryButton>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
