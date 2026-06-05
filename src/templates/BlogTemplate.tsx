'use client';

import { AnimatePresence, motion } from 'motion/react';

import BlogFooter from '@/components/blog/BlogFooter';
import BlogHeader from '@/components/blog/BlogHeader';
import { usePathname } from '@/libs/i18nNavigation';

const BlogTemplate = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 font-poppins text-stone-900 antialiased selection:bg-stone-900 selection:text-stone-50">
      {/* Subtle grain overlay — barely perceptible, kills the flatness of pure off-white. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025] mix-blend-multiply"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.7) 1px, transparent 0)',
          backgroundSize: '3px 3px',
        }}
      />
      <BlogHeader />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          className="relative z-[1] flex-1"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <BlogFooter />
    </div>
  );
};

export default BlogTemplate;
