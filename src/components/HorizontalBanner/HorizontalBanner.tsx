'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const HorizontalBanner = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [textWidth, setTextWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Verificação da largura da janela quando o componente é montado
    setWindowWidth(window.innerWidth);

    const updateMeasurements = () => {
      if (textRef.current) {
        setTextWidth(textRef.current.scrollWidth);
      }
      setWindowWidth(window.innerWidth);
    };

    updateMeasurements();
    window.addEventListener('resize', updateMeasurements);
    return () => window.removeEventListener('resize', updateMeasurements);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Transformar o progresso do scroll vertical em movimento horizontal - motion não permite uma nomeclatura diferente de 'x'
  const x = useTransform(
    scrollYProgress,
    [0.2, 0.8],
    [0, -textWidth + windowWidth],
  );

  return (
    <section
      ref={sectionRef}
      className="w-full overflow-hidden"
    >
      <div className="flex h-full items-center">
        <motion.div
          ref={textRef}
          style={{ x }}
          className="whitespace-nowrap "
        >
          <h2 className="px-12 text-7xl tracking-wider text-transparent text-stroke-2 text-stroke-[#373737] sm:text-9xl">
            CRIATIVIDADE ● DIGITAL ● INOVAÇÃO
          </h2>
        </motion.div>
      </div>
    </section>
  );
};

export default HorizontalBanner;
