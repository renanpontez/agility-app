'use client';

import { useState } from 'react';
import { IoChevronDown } from 'react-icons/io5';

import RevealOnScroll from './RevealOnScroll';

export type FaqItem = {
  q: string;
  a: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

const FaqAccordion = ({ items }: FaqAccordionProps) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <RevealOnScroll key={i} delay={i * 80}>
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] transition-colors hover:border-white/10">
            <button
              className="flex w-full items-center justify-between gap-4 p-6 text-left"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              type="button"
            >
              <span className="font-semibold">{item.q}</span>
              <IoChevronDown
                className={`size-5 shrink-0 text-white/40 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ${openFaq === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 leading-relaxed text-white/50">{item.a}</p>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  );
};

export default FaqAccordion;
