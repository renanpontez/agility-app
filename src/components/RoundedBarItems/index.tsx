'use client';

import { useSpring } from '@react-spring/web';
import classNames from 'classnames';
import React, { useEffect } from 'react';

import Card from '@/components/Card';
import Text from '@/components/Text';

const RoundedItem = ({ item, count }: { item: any; count: number }) => {
  const [fadeIn, fadeInApi] = useSpring(() => ({
    from: { opacity: 0 },
  }));

  useEffect(() => {
    fadeInApi.start({ opacity: 1, delay: count * 300 });
  }, [fadeInApi, count]);

  return (
    <div key={item.title} className="flex flex-col items-center justify-center gap-2" style={{ ...fadeIn }}>
      <Text as="h2" className="text-center tracking-wider text-primary">
        {item.title}
        <span className="block text-center text-xs font-normal text-secondaryLighter">{item.description}</span>
      </Text>
    </div>
  );
};

const RoundedBarItems: React.FC = () => {
  const [fadeSlideIn, fadeSlideInApi] = useSpring(() => ({
    from: { opacity: 0, y: -500 },
  }));

  useEffect(() => {
    fadeSlideInApi.start({ opacity: 1, y: 0, delay: 300 });
  }, [fadeSlideInApi]);

  const EXPERIENCES = [{
    title: '11',
    description: 'ANOS DE EXPERIÊNCIA',
  }, {
    title: '+50',
    description: 'PROJETOS CONCLUÍDOS',
  }, {
    title: '+90%',
    description: 'CLIENTES APROVAM',
  }, {
    title: '5',
    description: 'MENTES CRIATIVAS',
  }];

  return (
    <div style={{ ...fadeSlideIn }}>
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
