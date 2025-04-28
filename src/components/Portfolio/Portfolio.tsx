'use client';
import { motion } from 'motion/react';
import React from 'react';

import type { Project } from '@/types/portfolio';

import PortfolioItem from './PortfolioItem';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Portfolio: React.FC<{ items: Array<Project> }> = ({ items }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid w-full grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
    >
      {items.map(item => (
        <motion.div key={item.slug} variants={itemVariants}>
          <PortfolioItem
            imageSrc={item.thumbnailImage}
            title={item.name}
            description={item.introTitle}
            href={`/portfolio/${item.slug}`}
            linkPropsOverride={{ target: '_self', rel: '' }}
          />
        </motion.div>

      ))}
    </motion.div>
  );
};

export default Portfolio;
