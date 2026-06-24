'use client';

// Reserved for a future 2D fallback render of the slot symbols (e.g. when we
// add a no-canvas paytable preview in the settings drawer). The active game
// renders symbols via WebGL through SlotMachine3D + symbolToDataUri.ts, so
// this component is intentionally a no-op placeholder for now.
import type { SymbolId } from '../lib/types';

type Props = {
  symbol: SymbolId;
  className?: string;
};

export default function SymbolGlyph({ symbol, className = '' }: Props) {
  return (
    <div role="img" aria-label={symbol} className={className} data-symbol={symbol} />
  );
}
