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
      className="flex flex-col items-center justify-center gap-2 py-16"
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: item.count * 0.2 + 0.5 }}
      viewport={{ once: true }}
    >
      <Text as="h2" className="flex items-center text-center text-4xl tracking-wider text-transparent text-stroke-white hover:text-stroke-white hover:text-stroke-fill-primary">
        <div className="text-stroke text-stroke-inherit hover:text-stroke-inherit">
          {item.prefix}
        </div>
        <motion.pre className="text-stroke text-transparent ">
          {rounded}
        </motion.pre>

        <div className="text-stroke ">
          {item.refix}
        </div>
      </Text>
      <span className="block text-center text-xs font-normal text-secondaryLighter">{item.description}</span>

    </motion.div>
  );
};

const RoundedBarItems: React.FC = () => {
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
    <div className="mx-auto bg-secondaryDarker">
      <div className={classNames(
        'flex flex-col items-center justify-between gap-16 px-10 py-4',
        'md:flex-row md:gap-16 lg:gap-24',
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
