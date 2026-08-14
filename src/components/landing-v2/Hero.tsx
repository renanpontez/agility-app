'use client';

import type { Variants } from 'motion/react';
import { motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { FiArrowUpRight } from 'react-icons/fi';

import Starfield from './Starfield';

const EASE = [0.16, 1, 0.3, 1] as const;

type HeroCta = { label: string; href: string };

type V2HeroProps = {
  titlePrefix?: string;
  highlight?: string;
  subtitle?: string;
  cta1?: HeroCta;
  cta2?: HeroCta;
};

/**
 * Centered, text-first hero. Owns the starfield: the sky is one viewport tall
 * and fades out at the fold, so it reads as the opening frame rather than as
 * wallpaper for the whole site. Entrance choreography:
 *  1. Navbar drops in from the top (handled in Navbar).
 *  2. After a short beat, the headline cascades in word by word (blur +
 *     opacity → crisp), then the subtitle and the two CTAs.
 * Collapses to a plain fade under prefers-reduced-motion.
 * Buttons only transition their background on hover — no movement.
 */
const V2Hero = ({ titlePrefix, highlight, subtitle, cta1, cta2 }: V2HeroProps) => {
  const t = useTranslations('Hero');
  const reduce = useReducedMotion();

  const resolvedPrefix = titlePrefix ?? t('titlePrefix');
  const resolvedHighlight = highlight ?? t('highlight');
  const resolvedSubtitle = subtitle ?? t('subtitle');
  const resolvedCta1 = cta1 ?? { label: t('cta1'), href: '#Contato' };
  const resolvedCta2 = cta2 ?? { label: t('cta2'), href: '#Servicos' };

  const prefixWords = resolvedPrefix.split(' ');
  const highlightWords = resolvedHighlight.split(' ');

  // Outer cascade: headline → subtitle → CTAs.
  const outer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  };
  // Headline orchestrates its own word-by-word stagger.
  const headline: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.075 } },
  };
  // The reveal used for every element and every word.
  const item: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 14, filter: 'blur(10px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: EASE },
    },
  };

  return (
    <section
      id="Home"
      className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-32 text-center sm:px-6"
    >
      <Starfield />

      <motion.div
        variants={outer}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center"
      >
        {/* Headline — word by word, blur → crisp */}
        <motion.h1
          variants={headline}
          className="font-display text-[2.05rem] font-semibold leading-[1.06] tracking-[-0.02em] text-white sm:text-[2.75rem] lg:text-[3.4rem]"
        >
          <span className="sr-only">{`${resolvedPrefix} ${resolvedHighlight}`}</span>
          <span aria-hidden className="flex flex-wrap justify-center gap-x-[0.26em]">
            {prefixWords.map((word, i) => (
              <motion.span key={`p-${i}`} variants={item} className="inline-block will-change-[filter,transform,opacity]">
                {word}
              </motion.span>
            ))}
          </span>
          <span aria-hidden className="mt-1 flex flex-wrap justify-center gap-x-[0.26em]">
            {highlightWords.map((word, i) => (
              <motion.span
                key={`h-${i}`}
                variants={item}
                className="inline-block bg-clip-text text-transparent will-change-[filter,transform,opacity]"
                style={{ backgroundImage: 'linear-gradient(180deg, #fff 0%, var(--violet-100) 42%, var(--violet-500) 100%)' }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg"
        >
          {resolvedSubtitle}
        </motion.p>

        {/* Two CTAs — background transition only, no movement */}
        <motion.div variants={item} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href={resolvedCta1.href}
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-colors duration-300 ease-out hover:bg-white/85"
          >
            {resolvedCta1.label}
            <FiArrowUpRight className="size-4" />
          </a>
          <a
            href={resolvedCta2.href}
            className="inline-flex items-center rounded-full border border-white/15 px-7 py-3.5 text-sm font-medium text-white/85 transition-colors duration-300 ease-out hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
          >
            {resolvedCta2.label}
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/15 p-1.5">
          <motion.span
            className="size-1 rounded-full bg-white/60"
            animate={reduce ? {} : { y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default V2Hero;
