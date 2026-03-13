'use client';

import { AnimatePresence, motion } from 'motion/react';

import V2Footer from '@/components/landing-v2/Footer';
import V2Navbar from '@/components/landing-v2/Navbar';
import ParallaxBlobs from '@/components/landing-v2/ParallaxBlobs';
import { usePathname } from '@/libs/i18nNavigation';

const LandingV2Template = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen bg-[#050505] font-poppins text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_rgba(188,1,253,0.04)_0%,_transparent_60%)]" />
      <ParallaxBlobs />
      <V2Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          className="relative z-[1]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <V2Footer />
    </div>
  );
};

export default LandingV2Template;
