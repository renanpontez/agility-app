'use client';
import { motion } from 'motion/react';
import Image from 'next/image';

import Button from '../Button';
import Text from '../Text';

const AboutUs = () => {
  return (
    <div className="flex">
      <div className="w-1/2">
        <Text as="h3" className="mb-8">
          <span className="font-bold">
            <b>
              <span className="relative inline-block">
                <span className="before:absolute before:left-0 before:top-8 before:h-[3px] before:w-full before:bg-primary">
                  QU
                </span>
              </span>
              EM
            </b>

          </span>
          {' '}
          SOMOS
        </Text>
        <Text as="p" styleOverride="h5">
          A gente acredita que organizando o processo criativo e trabalhando em parceria com o cliente, conseguimos
          {' '}
          <b className="text-primaryLighter">multiplicar os resultados</b>
          {' '}
          do seu projeto.
        </Text>
        <br />
        <Text as="p" styleOverride="h5">
          A Agility tem como meta entregar sempre mais do que o esperado. Nós seremos uma parceria leve que vai te levar para mais perto do sucesso do seu projeto!

        </Text>
        <Button style="outlined-light" className="mt-10"> Saiba mais</Button>

      </div>
      <div className="relative w-1/2">
        <span>
          <span className="h-16 w-56 rotate-45 bg-transparent"></span>
          <span className="h-16 w-72 rotate-45 bg-transparent"></span>
          <span className="h-16 w-64 rotate-45 bg-transparent"></span>
          <span className="h-16 w-44 rotate-45 bg-transparent"></span>

        </span>
        <div className="relative">
          <div className="relative z-0 m-auto h-auto w-1/2">
            {/* Imagem animada que fica por baixo */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop',
              }}
              className="absolute inset-0 z-0"
            >
              <Image
                src="/assets/images/about-us-img.svg"
                alt="agility team background"
                width={500}
                height={400}
                className="h-auto w-full object-cover"
              />
            </motion.div>

            {/* Máscara fixa que fica por cima */}
            <div className="relative z-10">
              <Image
                src="/assets/images/about-us-mask.svg"
                alt="agility team mask"
                width={500}
                height={400}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
