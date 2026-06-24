'use client';

import type { InputHTMLAttributes } from 'react';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
  hint?: string;
  valueLabel: string;
};

export default function Slider({ label, hint, valueLabel, className = '', ...rest }: Props) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-medium text-white/85">{label}</span>
        <span className="font-mono text-[13px] tabular-nums text-amber-300">{valueLabel}</span>
      </div>
      <input
        type="range"
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
        {...rest}
      />
      {hint
        ? <span className="text-[11.5px] leading-snug text-white/45">{hint}</span>
        : null}
    </label>
  );
}
