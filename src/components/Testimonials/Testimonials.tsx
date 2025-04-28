'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import Text from '@/components/Text';

const Testimonials: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const testimonials = [
    {
      message:
        'Nossa presença digital foi transformada com um site que superou expectativas. O resultado impulsionou nossos negócios, e a experiência com a equipe foi excepcional!',
      author: 'Leandro P | Agillock Gestão de Risco',
    },
    {
      message:
        'Nossa presença digital foi transformada com um site que superou expectativas. O resultado impulsionou nossos negócios, e a experiência com a equipe foi excepcional!',
      author: 'Leandro P | Agillock Gestão de Risco',
    },
    {
      message:
        'Nossa presença digital foi transformada com um site que superou expectativas. O resultado impulsionou nossos negócios, e a experiência com a equipe foi excepcional!',
      author: 'Leandro P | Agillock Gestão de Risco',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-center overflow-hidden px-5 py-3">
      <Text as="h2" className="mb-8 text-center">
        O QUE NOSSOS CLIENTES FALAM
      </Text>

      <div className="relative w-full max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -left-5 -top-5">
              <Text as="p" className="font-serif text-5xl italic text-primaryLighter">"</Text>
            </div>

            <div className="mt-8 flex w-fit flex-col gap-2 px-5 ">
              <Text as="p" className="tracking-wider">
                {testimonials[current]?.message}
              </Text>
              <Text as="em" className="text-secondaryLighter">
                {testimonials[current]?.author}
              </Text>
            </div>

            <div className="absolute -bottom-10 -right-0">
              <Text as="p" className="font-serif text-5xl italic text-primaryLighter">"</Text>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
export default Testimonials;
