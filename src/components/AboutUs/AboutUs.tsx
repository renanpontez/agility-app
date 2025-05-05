'use client';
import { motion } from 'framer-motion';
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
            </b>
            EM
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
      <div className="mask-custom relative h-[400px] w-full lg:w-1/2 ">

        <motion.div
          className="relative size-full" // Importante para o fill funcionar
          animate={{
            x: [0, 10, 0, -10, 0], // Movimento horizontal mais suave
            y: [0, -10, 0, 10, 0], // Movimento vertical mais suave
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Image
            src="/assets/images/about-us-img.svg"
            alt="Background"
            fill
            className="object-cover"
          />
        </motion.div>

      </div>
    </div>
  );
};

export default AboutUs;
