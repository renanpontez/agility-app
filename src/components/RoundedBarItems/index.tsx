'use client';

import classNames from 'classnames';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import React, { useEffect } from 'react';

import Card from '@/components/Card';
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
      className="flex flex-col items-center justify-center gap-2"
    >
      <Text as="h2" className="flex text-center tracking-wider text-primary">
        {item.prefix}
        <motion.pre>{rounded}</motion.pre>
        {item.refix}
      </Text>
      <span className="block text-center text-xs font-normal text-secondaryLighter">{item.description}</span>

    </motion.div>
  );
};

const RoundedBarItems: React.FC = () => {
  const EXPERIENCES = [{
    title: 11,
    description: 'ANOS DE EXPERIÊNCIA',
  }, {
    prefix: '+',
    title: 50,
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
    <div>
      <Card className="mx-auto animate-pulseShadow bg-secondaryDarker">
        <div className={classNames(
          'flex flex-col items-center justify-between gap-16 px-10 py-4',
          'md:flex-row md:gap-16 lg:gap-24',
        )}
        >
          {EXPERIENCES.map((item, idx) => (
            <RoundedItem key={item.title} item={item} count={idx} />
          ))}
        </div>
      </Card>
    </div>

  );
};

export default RoundedBarItems;
