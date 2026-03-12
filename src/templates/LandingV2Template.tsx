'use client';

import V2Footer from '@/components/landing-v2/Footer';
import V2Navbar from '@/components/landing-v2/Navbar';
import ParallaxBlobs from '@/components/landing-v2/ParallaxBlobs';

const LandingV2Template = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen bg-[#050505] font-poppins text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_rgba(188,1,253,0.04)_0%,_transparent_60%)]" />
      <ParallaxBlobs />
      <V2Navbar />
      <main className="relative z-[1]">
        {children}
      </main>
      <V2Footer />
    </div>
  );
};

export default LandingV2Template;
