'use client';

import { AnimatePresence, motion } from 'motion/react';

import BlogFooter from '@/components/blog/BlogFooter';
import BlogHeader from '@/components/blog/BlogHeader';
import type { BlogCategoryRef } from '@/components/blog/categories';
import { usePathname } from '@/libs/i18nNavigation';

type BlogTemplateProps = {
  children: React.ReactNode;
  // Categories pre-fetched in the (server) layout — the header dropdown
  // needs them but BlogTemplate is a client component, so we pass them down
  // instead of refetching on the client.
  categories?: BlogCategoryRef[];
};

const BlogTemplate = ({ children, categories = [] }: BlogTemplateProps) => {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-white font-poppins text-stone-900 antialiased selection:bg-stone-900 selection:text-stone-50">
      <BlogHeader categories={categories} />
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
