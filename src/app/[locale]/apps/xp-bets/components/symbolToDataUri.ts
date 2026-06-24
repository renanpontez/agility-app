import type { SymbolId } from '../lib/types';

// Renders each symbol as a self-contained SVG and returns it as a data URI
// so Three.js can load it via TextureLoader without any network fetches.
// The SVGs are visually richer than the React component variant: pure SVG,
// no JSX, denser detail, sized for a 256px square texture upscale.

const svg = (inner: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">`
  + `<rect width="256" height="256" rx="32" fill="#1c1917"/>${inner}</svg>`;

const TIGER = svg(`
  <defs>
    <radialGradient id="tg" cx="0.5" cy="0.4" r="0.6">
      <stop offset="0%" stop-color="#fde047"/>
      <stop offset="60%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#9a3412"/>
    </radialGradient>
  </defs>
  <circle cx="128" cy="128" r="100" fill="url(#tg)"/>
  <ellipse cx="86" cy="100" rx="22" ry="26" fill="#1c1917"/>
  <ellipse cx="170" cy="100" rx="22" ry="26" fill="#1c1917"/>
  <ellipse cx="86" cy="96" rx="8" ry="10" fill="#fef3c7"/>
  <ellipse cx="170" cy="96" rx="8" ry="10" fill="#fef3c7"/>
  <path d="M 80 168 Q 128 200 176 168" stroke="#1c1917" stroke-width="12" stroke-linecap="round" fill="none"/>
  <path d="M 58 64 L 76 38 L 96 60 Z" fill="#fb923c" stroke="#7c2d12" stroke-width="3"/>
  <path d="M 198 64 L 180 38 L 160 60 Z" fill="#fb923c" stroke="#7c2d12" stroke-width="3"/>
  <path d="M 90 60 Q 100 90 90 110" stroke="#7c2d12" stroke-width="4" fill="none"/>
  <path d="M 166 60 Q 156 90 166 110" stroke="#7c2d12" stroke-width="4" fill="none"/>
`);

const GOLD = svg(`
  <rect x="32" y="68" width="192" height="148" rx="14" fill="#7c2d12"/>
  <rect x="42" y="60" width="172" height="36" rx="6" fill="#fbbf24" stroke="#92400e" stroke-width="3"/>
  <rect x="56" y="100" width="144" height="32" rx="5" fill="#facc15" stroke="#92400e" stroke-width="3"/>
  <rect x="48" y="138" width="160" height="32" rx="5" fill="#eab308" stroke="#92400e" stroke-width="3"/>
  <rect x="56" y="176" width="144" height="32" rx="5" fill="#ca8a04" stroke="#92400e" stroke-width="3"/>
`);

const GREEN = svg(`
  <defs>
    <radialGradient id="jg" cx="0.5" cy="0.4" r="0.5">
      <stop offset="0%" stop-color="#86efac"/>
      <stop offset="100%" stop-color="#14532d"/>
    </radialGradient>
  </defs>
  <circle cx="128" cy="128" r="92" fill="url(#jg)"/>
  <circle cx="128" cy="128" r="72" fill="none" stroke="#052e16" stroke-width="4" opacity="0.5"/>
  <circle cx="128" cy="128" r="28" fill="#022c22"/>
  <path d="M 128 30 L 118 60 L 138 60 Z" fill="#fde047" stroke="#a16207" stroke-width="2"/>
`);

const BLUE = svg(`
  <rect x="74" y="40" width="108" height="180" rx="14" fill="#1e3a8a"/>
  <rect x="86" y="56" width="84" height="148" rx="8" fill="#2563eb"/>
  <line x1="86" y1="100" x2="170" y2="100" stroke="#1e3a8a" stroke-width="4"/>
  <line x1="86" y1="160" x2="170" y2="160" stroke="#1e3a8a" stroke-width="4"/>
  <circle cx="128" cy="132" r="20" fill="#fde047"/>
  <circle cx="128" cy="132" r="10" fill="#fef9c3"/>
  <rect x="108" y="28" width="40" height="14" fill="#1e3a8a"/>
  <path d="M 74 220 L 182 220 L 172 228 L 84 228 Z" fill="#1e3a8a"/>
`);

const PURPLE = svg(`
  <defs>
    <radialGradient id="pg" cx="0.5" cy="0.6" r="0.6">
      <stop offset="0%" stop-color="#f0abfc"/>
      <stop offset="100%" stop-color="#581c87"/>
    </radialGradient>
  </defs>
  <path d="M 128 218 Q 36 196 56 124 Q 84 144 102 138 Q 84 88 128 60 Q 172 88 154 138 Q 172 144 200 124 Q 220 196 128 218 Z" fill="url(#pg)"/>
  <path d="M 128 218 Q 70 196 90 138 Q 110 150 128 154 Q 146 150 166 138 Q 186 196 128 218 Z" fill="#c026d3" opacity="0.85"/>
  <circle cx="128" cy="148" r="14" fill="#fbcfe8"/>
`);

const COIN = svg(`
  <defs>
    <radialGradient id="cg" cx="0.4" cy="0.4" r="0.6">
      <stop offset="0%" stop-color="#fde68a"/>
      <stop offset="100%" stop-color="#92400e"/>
    </radialGradient>
  </defs>
  <circle cx="128" cy="128" r="98" fill="url(#cg)"/>
  <circle cx="128" cy="128" r="82" fill="none" stroke="#7c2d12" stroke-width="4" opacity="0.6"/>
  <rect x="108" y="108" width="40" height="40" fill="#451a03"/>
`);

const WILD = svg(`
  <defs>
    <linearGradient id="wg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#a21caf"/>
      <stop offset="100%" stop-color="#7c2d12"/>
    </linearGradient>
  </defs>
  <rect x="20" y="20" width="216" height="216" rx="28" fill="url(#wg)"/>
  <rect x="32" y="32" width="192" height="192" rx="22" fill="#c026d3" opacity="0.9"/>
  <text x="128" y="152" text-anchor="middle" font-family="Georgia, serif" font-size="68" font-weight="900" fill="#fde047" stroke="#7c1d6f" stroke-width="3">WILD</text>
`);

const BAMBOO = svg(`
  <rect x="108" y="20" width="14" height="216" fill="#15803d" opacity="0.85"/>
  <rect x="108" y="56" width="14" height="4" fill="#052e16"/>
  <rect x="108" y="108" width="14" height="4" fill="#052e16"/>
  <rect x="108" y="160" width="14" height="4" fill="#052e16"/>
  <rect x="108" y="212" width="14" height="4" fill="#052e16"/>
  <ellipse cx="84" cy="86" rx="36" ry="14" transform="rotate(-30 84 86)" fill="#22c55e" opacity="0.85"/>
  <ellipse cx="170" cy="150" rx="36" ry="14" transform="rotate(30 170 150)" fill="#22c55e" opacity="0.85"/>
  <ellipse cx="172" cy="80" rx="28" ry="10" transform="rotate(35 172 80)" fill="#16a34a" opacity="0.7"/>
`);

const SOURCE: Record<SymbolId, string> = {
  tiger: TIGER,
  gold: GOLD,
  green: GREEN,
  blue: BLUE,
  purple: PURPLE,
  coin: COIN,
  wild: WILD,
  bamboo: BAMBOO,
};

// Encoded once per symbol per process — cheap, no need to memoize further.
const CACHE = new Map<SymbolId, string>();

export const renderSymbolDataUri = (sym: SymbolId): string => {
  if (!CACHE.has(sym)) {
    const xml = SOURCE[sym];
    const encoded = encodeURIComponent(xml).replace(/'/g, '%27').replace(/"/g, '%22');
    CACHE.set(sym, `data:image/svg+xml,${encoded}`);
  }
  return CACHE.get(sym)!;
};
