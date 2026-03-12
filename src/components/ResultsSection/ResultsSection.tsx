'use client';

import { motion } from 'motion/react';
import type { FC } from 'react';

import Text from '@/components/Text';

type StatItem = {
  value: string;
  description: string;
};

const STATS: StatItem[] = [
  { value: '12+', description: 'anos de experiência' },
  { value: '60%', description: 'sites mais rápidos' },
  { value: '30+', description: 'projetos entregues' },
  { value: '2x', description: 'mais conversão' },
  { value: '50%', description: 'menos custos com nuvem' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: index * 0.12,
      ease: 'easeOut',
    },
  }),
};

const StatCard: FC<{ item: StatItem; index: number }> = ({ item, index }) => {
  return (
    <motion.div
      className="flex min-w-[180px] flex-col items-center justify-center gap-2 rounded-3xl bg-secondaryDarker px-5 py-8"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      custom={index}
    >
      <Text
        as="span"
        className="text-5xl font-extrabold leading-tight tracking-tight text-white"
      >
        {item.value}
      </Text>
      <Text
        as="p"
        className="text-center text-sm font-normal leading-snug text-slate-50"
      >
        {item.description}
      </Text>
    </motion.div>
  );
};

const ResultsSection: FC = () => {
  return (
    <div>
      <Text
        as="h3"
        className="mb-10 text-[28px] font-semibold text-white"
      >
        Nossos resultados
      </Text>

      <div className="flex gap-4 overflow-x-auto pb-4 lg:gap-5 lg:overflow-x-visible lg:pb-0">
        {STATS.map((stat, index) => (
          <StatCard key={stat.value} item={stat} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ResultsSection;
