'use client';

import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import LocaleSwitcher from '@/components/LocaleSwitcher';
import { Link } from '@/libs/i18nNavigation';

const HIDE_AFTER = 80;
const SHADOW_AFTER = 8;

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
    setScrolled(latest > SHADOW_AFTER);
  });

  return (
    <motion.header
      className={`sticky top-0 z-50 border-b transition-shadow duration-300 ${
        scrolled ? 'border-neutral-200 bg-white/95 shadow-[0_1px_0_rgba(0,0,0,0.02)] backdrop-blur' : 'border-transparent bg-white'
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden ? -80 : 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/assets/images/logo/logo_symbol_black.svg" alt="Agility" width={26} height={26} />
          <Image src="/assets/images/logo/logo_name_black.svg" alt="Agility" width={82} height={20} className="hidden sm:block" />
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/blog"
            className="rounded-full px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            {tBlog('badge')}
          </Link>
          <Link
            href="/"
            className="hidden rounded-full px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 sm:inline-block"
          >
            {t('home')}
          </Link>
          <LocaleSwitcher theme="light" className="ml-1" />
          <Link
            href="/#Contato"
            className="ml-1 hidden rounded-full bg-neutral-900 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 sm:inline-block"
          >
            {t('cta')}
          </Link>
        </nav>
      </div>
    </motion.header>
  );
};

export default BlogHeader;
