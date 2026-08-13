/**
 * Fixed atmospheric backdrop for the marketing surface: a faint technical grid,
 * two drifting violet aurora glows with a cool ice rim, and a whisper of
 * champagne warmth. Pure CSS — the drift pauses under prefers-reduced-motion.
 * Server component (no client hooks needed).
 */
const SiteAtmosphere = () => {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Technical grid, fading toward the edges */}
      <div
        className="bg-grid absolute inset-0 opacity-[0.5]"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 10%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 10%, transparent 75%)',
        }}
      />

      {/* Primary violet aurora, top-right */}
      <div
        className="animate-auroraDrift absolute -right-[10%] -top-[20%] size-[70vw] max-w-[900px] rounded-full"
        style={{
          background: 'radial-gradient(circle, oklch(0.62 0.29 309 / 0.28) 0%, transparent 62%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Secondary deep-violet aurora, lower-left */}
      <div
        className="animate-auroraDrift absolute -left-[12%] top-[45%] size-[55vw] max-w-[720px] rounded-full"
        style={{
          background: 'radial-gradient(circle, oklch(0.46 0.24 308 / 0.22) 0%, transparent 65%)',
          filter: 'blur(80px)',
          animationDelay: '-9s',
        }}
      />

      {/* Cool ice rim to keep the violet from going flat */}
      <div
        className="absolute right-[20%] top-[8%] size-[26vw] max-w-[380px] rounded-full"
        style={{
          background: 'radial-gradient(circle, oklch(0.82 0.10 250 / 0.14) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Champagne warmth — barely there */}
      <div
        className="absolute bottom-[6%] left-[38%] size-[24vw] max-w-[340px] rounded-full"
        style={{
          background: 'radial-gradient(circle, oklch(0.86 0.06 85 / 0.07) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Fine film grain for a premium, non-flat surface */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-soft-light"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'140\' height=\'140\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
      />

      {/* Vignette to seat the content */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 90% at 50% 0%, transparent 55%, oklch(0.10 0.01 300 / 0.55) 100%)' }}
      />
    </div>
  );
};

export default SiteAtmosphere;
