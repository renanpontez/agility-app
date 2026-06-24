'use client';

import { AnimatePresence, motion } from 'motion/react';

import type { LineWin } from '../lib/types';

type Props = {
  wins: LineWin[];
};

// 3x3 grid mapping. Cells are positioned in a (50, 50) origin with 60-unit
// spacing — keeps the overlay independent of pixel sizing and lets the
// container resize freely. Drawn over the 3D canvas.
const CELL = 60;
const ORIGIN = 50;

const cellCenter = (row: number, col: number): [number, number] => [
  ORIGIN + col * CELL,
  ORIGIN + row * CELL,
];

const LINE_COLORS = [
  '#fbbf24',
  '#f472b6',
  '#34d399',
  '#60a5fa',
  '#f97316',
];

export default function WinLineOverlay({ wins }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <AnimatePresence>
        {wins.length > 0 && (
          <motion.svg
            key={wins.map(w => w.lineId).join('-')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            viewBox="0 0 220 220"
            className="h-full w-auto max-w-[90%]"
          >
            {wins.map((w, i) => {
              const color = LINE_COLORS[w.lineId % LINE_COLORS.length]!;
              const path = w.cells
                .map(([r, c], idx) => {
                  const [x, y] = cellCenter(r, c);
                  return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                })
                .join(' ');
              return (
                <g key={`${w.lineId}-${i}`}>
                  <motion.path
                    d={path}
                    fill="none"
                    stroke={color}
                    strokeWidth={3.5}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0.4 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                  {w.cells.map(([r, c]) => {
                    const [x, y] = cellCenter(r, c);
                    return (
                      <motion.circle
                        key={`${r}-${c}`}
                        cx={x}
                        cy={y}
                        r={22}
                        fill="none"
                        stroke={color}
                        strokeWidth={2}
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: [1, 1.15, 1], opacity: 1 }}
                        transition={{ duration: 0.7, repeat: Infinity, repeatType: 'mirror' }}
                      />
                    );
                  })}
                </g>
              );
            })}
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  );
}
