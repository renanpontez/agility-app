'use client';

import { AnimatePresence, motion } from 'motion/react';

import BlogFooter from '@/components/blog/BlogFooter';
import BlogHeader from '@/components/blog/BlogHeader';
import { usePathname } from '@/libs/i18nNavigation';

const BlogTemplate = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-white font-poppins text-neutral-900 antialiased">
      <BlogHeader />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          className="flex-1"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: 'easeInOut' as const }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <BlogFooter />
    </div>
  );
};

export default BlogTemplate;
