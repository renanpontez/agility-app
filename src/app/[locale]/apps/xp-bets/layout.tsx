import type { ReactNode } from 'react';

// Bare layout — the xp-bets experience runs full-screen without the site's
// V2Navbar / V2Footer. Mirrors the pattern used by /apps/agiliza-meu-carro.
// We also lock body overflow so the casino floor doesn't bleed into the
// document scroll, except in the Reveal phase which scrolls naturally.
export default function XpBetsLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-[100dvh] bg-stone-950">{children}</div>;
}
