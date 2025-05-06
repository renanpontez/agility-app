'use client';
import { motion } from 'motion/react';
import Image from 'next/image';

import Button from '../Button';
import Text from '../Text';

const AboutUs = () => {
  return (
    <div className="flex flex-wrap">
      <div className="w-full lg:w-1/2">
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
      <div className="relative mb-20 w-full sm:mb-0 lg:w-1/2">
        <div className="relative">
          <div className="relative z-0 m-auto h-[400px] w-full max-w-[568px] p-10">

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
              className="absolute -left-9 top-0 z-0 sm:left-4 lg:-top-10 lg:left-0"
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
                y: [-3, 10, -3],
              }}
              transition={{
                duration: 8,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop',
                delay: 0.5,
              }}
              className="absolute -left-8 top-0 z-0 sm:left-14 md:left-12 lg:-top-10 lg:left-8 xl:left-14"
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
                y: [-5, 15, -5],
              }}
              transition={{
                duration: 10,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop',
              }}
              className="absolute -bottom-4 -right-10 z-0 sm:right-10 md:right-14 md:top-20 lg:right-5 lg:top-20 xl:right-20"
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
                y: [-5, 15, -5],
              }}
              transition={{
                duration: 10,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop',
              }}
              className="absolute -right-6 bottom-0 z-0 sm:right-6 md:right-16 lg:-bottom-0 lg:right-4 xl:right-16"
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
