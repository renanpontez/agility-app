'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { track } from '../lib/analytics';
import PrimaryButton from './primitives/PrimaryButton';

type Props = {
  open: boolean;
  phase: 'idle' | 'processing' | 'failed';
  attempts: number;
  balance: number;
  onRequest: () => void;
  onRetry: () => void;
  onGiveUp: () => void;
  onClose: () => void;
};

// Rotating error messages mirror the textual stalling used by real predatory
// withdrawal flows. Index modulo 4 so the messaging changes with each retry.
const ERROR_KEYS = ['error1', 'error2', 'error3', 'error4'] as const;

export default function WithdrawModal({
  open,
  phase,
  attempts,
  balance,
  onRequest,
  onRetry,
  onGiveUp,
  onClose,
}: Props) {
  const t = useTranslations('xpBets.withdraw');
  const [processingShown, setProcessingShown] = useState(false);

  useEffect(() => {
    setProcessingShown(phase === 'processing');
  }, [phase]);

  useEffect(() => {
    if (attempts > 0) {
      track('xp_bets_withdraw_attempt', { attempt: attempts });
    }
  }, [attempts]);

  if (!open) {
    return null;
  }

  const errorKey = ERROR_KEYS[(attempts - 1) % ERROR_KEYS.length] ?? 'error1';
  const formattedBalance = new Intl.NumberFormat('pt-BR').format(Math.round(balance));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={phase === 'processing' ? undefined : onClose}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-stone-950 p-6 text-white ring-1 ring-white/10"
            role="dialog"
            aria-modal="true"
            aria-label={t('title')}
          >
            <header className="flex flex-col gap-1.5 text-center">
              <h3 className="text-xl font-semibold">{t('title')}</h3>
              <p className="text-sm text-white/55">{t('subtitle', { balance: formattedBalance })}</p>
            </header>

            <div className="mt-6 flex flex-col gap-4">
              {phase === 'idle' && (
                <PrimaryButton size="lg" onClick={onRequest}>
                  {t('cta')}
                </PrimaryButton>
              )}

              {phase === 'processing' && (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-300/30 border-t-amber-300" />
                  <span className="text-sm text-white/70">{t('processing')}</span>
                </div>
              )}

              {phase === 'failed' && (
                <div className="flex flex-col gap-4">
                  <div
                    role="alert"
                    className="rounded-2xl bg-rose-500/10 px-4 py-4 text-center ring-1 ring-rose-400/30"
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-300">
                      {t('errorTitle')}
                      {' '}
                      ·
                      {' '}
                      {t('attemptLabel')}
                      {' '}
                      {attempts}
                    </div>
                    <div className="mt-1 text-sm text-rose-100">{t(errorKey)}</div>
                  </div>
                  <PrimaryButton size="md" variant="primary" onClick={onRetry}>
                    {t('retry')}
                  </PrimaryButton>
                  <button
                    type="button"
                    onClick={onGiveUp}
                    className="text-[12px] font-medium text-white/55 underline-offset-2 hover:text-white/80 hover:underline"
                  >
                    {t('giveUp')}
                  </button>
                </div>
              )}

              {phase === 'idle' && (
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[12px] font-medium text-white/55 underline-offset-2 hover:text-white/80 hover:underline"
                >
                  {t('cancel')}
                </button>
              )}
            </div>
            {/* Suppress unused warning until we wire processingShown into nicer transitions. */}
            <span className="sr-only">{processingShown ? '' : ''}</span>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
