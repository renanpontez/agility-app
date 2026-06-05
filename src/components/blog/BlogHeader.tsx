'use client';

import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Link } from '@/libs/i18nNavigation';

const HIDE_AFTER = 120;
const ELEVATE_AFTER = 8;

const BlogHeader = () => {
  const t = useTranslations('Navbar');
  const tBlog = useTranslations('BlogPage');
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const goingDown = latest > previous;
    setHidden(latest > HIDE_AFTER && goingDown);
    setScrolled(latest > ELEVATE_AFTER);
  });

  return (
    <motion.header
      className={`sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? 'border-b border-stone-200/70 bg-stone-50/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-stone-50'
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden ? -80 : 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <Image src="/assets/images/logo/logo_symbol_black.svg" alt="Agility" width={26} height={26} />
          <Image src="/assets/images/logo/logo_name_black.svg" alt="Agility" width={82} height={20} className="hidden sm:block" />
        </Link>

        <nav className="flex items-center gap-1 sm:gap-1.5">
          <Link
            href="/blog"
            className="rounded-full px-3.5 py-2 text-[13px] font-medium tracking-tight text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
          >
            {tBlog('badge')}
          </Link>
          <Link
            href="/"
            className="hidden rounded-full px-3.5 py-2 text-[13px] font-medium tracking-tight text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 sm:inline-block"
          >
            {t('home')}
          </Link>
          <Link
            href="/#Contato"
            className="ml-1.5 hidden items-center gap-1.5 rounded-full bg-stone-900 px-4 py-2 text-[13px] font-medium tracking-tight text-stone-50 shadow-[0_1px_2px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all hover:bg-stone-800 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.08)] sm:inline-flex"
          >
            {t('cta')}
            <span aria-hidden className="text-stone-400">→</span>
          </Link>
        </nav>
      </div>
    </motion.header>
  );
};

export default BlogHeader;
