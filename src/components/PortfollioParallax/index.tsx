'use client';

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { useBreakpoint } from '../../hooks/useBreakpoint';

export const Header = () => {
  return (
    <div className="relative left-0 top-0 mx-auto w-full max-w-7xl px-4 py-10 md:py-16">
      <h1 className="text-2xl font-bold md:text-7xl dark:text-white">
        PROJETOS QUE FIZERAM
        {' '}
        <br />
        {' '}
        A DIFERENÇA NA NOSSA HISTÓRIA
      </h1>
      <p className="mt-8 max-w-2xl text-base md:text-xl dark:text-neutral-200">
        Conheça os cases de sucesso que nos inspiram a cada dia.
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
}) => {
  return (
    <Link
      href={product.link}
      className="block size-full"
    >
      <Image
        src={product.thumbnail}
        height={600}
        width={600}
        className="size-full rounded-xl object-cover object-left-top"
        alt={product.title}
      />
      <div className="pointer-events-none absolute inset-0 size-full rounded-xl bg-black opacity-0 transition-opacity duration-300 group-hover/product:opacity-80"></div>
      <h2 className="absolute bottom-4 left-4 text-white opacity-0 transition-opacity duration-300 group-hover/product:opacity-100">
        {product.title}
      </h2>
    </Link>
  );
};

export function PortfolioParallax({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) {
  // Repete os produtos até ter pelo menos 10 itens
  let repeatedProducts = products;
  if (products.length > 0 && products.length < 10) {
    const times = Math.ceil(10 / products.length);
    repeatedProducts = Array(times).fill(products).flat().slice(0, 10);
  }

  const firstRow = repeatedProducts.slice(0, 5);
  const secondRow = repeatedProducts.slice(5, 10);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const { isMobile } = useBreakpoint();

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig,
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig,
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig,
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig,
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig,
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], isMobile ? [-500, -100] : [-700, 150]),
    springConfig,
  );
  return (
    <div
      ref={ref}
      className="relative mt-20 flex h-[870px] flex-col self-auto overflow-hidden pt-12 antialiased [perspective:1000px] [transform-style:preserve-3d] sm:h-[1500px] sm:pt-0"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="mb-10 mt-32 flex flex-row-reverse space-x-20 space-x-reverse sm:mt-0">
          {firstRow.map(product => (
            <motion.div
              style={{ x: translateX }}
              whileHover={{ y: -20 }}
              key={product.title + product.link}
              className="group/product relative size-60 shrink-0 overflow-hidden sm:h-96 sm:w-[30rem]"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
        {secondRow.length > 0 && (
          <motion.div className="mb-10 flex flex-row space-x-20 ">
            {secondRow.map(product => (
              <motion.div
                style={{ x: translateXReverse }}
                whileHover={{ y: -20 }}
                key={product.title + product.link}
                className="group/product relative size-60 shrink-0 overflow-hidden sm:h-96 sm:w-[30rem]"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
