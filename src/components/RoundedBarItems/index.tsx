'use client';

import classNames from 'classnames';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import React, { useEffect } from 'react';

import Text from '@/components/Text';

const RoundedItem = ({ item }: { item: any; count: number }) => {
  const startValue = useMotionValue(0);
  const rounded = useTransform(() => Math.round(startValue.get()));

  useEffect(() => {
    const controls = animate(startValue, item.title, { duration: 1 });
    return () => controls.stop();
  }, []);

  return (
    <motion.div
      key={item.title}
      className="flex flex-col items-center justify-center gap-1 py-4 md:gap-2 md:py-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: item.count * 0.15 + 0.3 }}
      viewport={{ once: true }}
    >
      <Text as="h2" className="flex items-center text-center text-2xl tracking-wider text-white hover:text-stroke-fill-primary md:text-4xl">
        <div className="text-stroke text-stroke-inherit hover:text-stroke-inherit">
          {item.prefix}
        </div>
        <motion.pre className="text-stroke text-white">
          {rounded}
        </motion.pre>

        <div className="text-stroke ">
          {item.refix}
        </div>
      </Text>
      <span className="block text-center text-xxs font-normal uppercase tracking-wider text-secondaryLighter md:text-xs">{item.description}</span>
    </motion.div>
  );
};

type RoundedBarItemsProps = {
  variant?: 'default' | 'overlay';
};

const RoundedBarItems: React.FC<RoundedBarItemsProps> = ({ variant = 'default' }) => {
  const EXPERIENCES = [{
    title: 10,
    description: 'ANOS DE EXPERIÊNCIA',
  }, {
    prefix: '+',
    title: 25,
    description: 'PROJETOS CONCLUÍDOS',
  }, {
    prefix: '+',
    refix: '%',
    title: 90,
    description: 'CLIENTES APROVAM',
  }, {
    title: 5,
    description: 'MENTES CRIATIVAS',
  }];

  return (
    <div className={classNames(
      'w-full',
      {
        'bg-secondaryDarker': variant === 'default',
        'border-t border-white/10 bg-black/40 backdrop-blur-sm': variant === 'overlay',
      },
    )}
    >
      <div className={classNames(
        'container grid grid-cols-2 items-center justify-between gap-6 py-2',
        'lg:grid-cols-4 md:gap-12 lg:gap-16',
      )}
      >
        {EXPERIENCES.map((item, idx) => (
          <RoundedItem key={item.title} item={item} count={idx} />
        ))}
      </div>
    </div>

  );
};

export default RoundedBarItems;
