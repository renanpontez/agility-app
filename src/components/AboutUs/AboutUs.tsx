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
        <div className="relative">
          <div className="relative z-0 m-auto h-[400px] w-full p-10">
            {/* Imagem animada que fica por baixo */}
            <motion.div
              animate={{
                y: [-5, 15, -5],
              }}
              transition={{
                duration: 10,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop',
              }}
              className="absolute right-5 top-32 z-0"
            >
              <Image
                src="/assets/images/rec1.svg"
                alt="agility team background"
                width={500}
                height={400}
                className="h-auto w-full object-cover"
              />
            </motion.div>
            <motion.div
              animate={{
                y: [-3, 10, -3],
              }}
              transition={{
                duration: 8,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop',
                delay: 0.5,
              }}
              className="absolute left-32 top-0 z-0"
            >
              <Image
                src="/assets/images/rec2.svg"
                alt="agility team background"
                width={500}
                height={400}
                className="h-auto w-full object-cover"
              />
            </motion.div>
            <motion.div
              animate={{
                y: [-4, 12, -4],
              }}
              transition={{
                duration: 10,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop',
                delay: 0.8,
              }}
              className="absolute left-12 top-4 z-0"
            >
              <Image
                src="/assets/images/rec3.svg"
                alt="agility team background"
                width={500}
                height={400}
                className="h-auto w-full object-cover"
              />
            </motion.div>
            <motion.div
              animate={{
                y: [-5, 15, -5],
              }}
              transition={{
                duration: 10,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop',
              }}
              className="absolute -bottom-8 right-0 z-0"
            >
              <Image
                src="/assets/images/rec4.svg"
                alt="agility team background"
                width={200}
                height={200}
                className="h-auto w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
