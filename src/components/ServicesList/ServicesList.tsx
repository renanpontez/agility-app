'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { CgWebsite } from 'react-icons/cg';
import { IoCartOutline, IoPhonePortraitOutline } from 'react-icons/io5';
import { TbDeviceAnalytics } from 'react-icons/tb';

import Card from '../Card';
import Text from '../Text';

const ServicesList: React.FC = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.4, // Delay each card by 0.2s
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  const services = [
    {
      icon: CgWebsite,
      title: `Sites/\nLanding Pages`,
      description: 'Sites que realmente entregam resultados para seu projeto',
    },
    {
      icon: IoPhonePortraitOutline,
      title: 'Aplicativos/\nJogos Digitais',
      description: 'Apps e jogos personalizados transformados em realidade',
    },
    {
      icon: IoCartOutline,
      title: 'Lojas Virtuais/\nE-commerce',
      description: 'Aproveite a expansão do mercado com vendas online',
    },
    {
      icon: TbDeviceAnalytics,
      title: 'Consultoria Dev\nTecnologia',
      description: 'Foco total em otimizar os resultados do seu projeto',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5 }}
    >

      <Text as="h3" className="mb-8">
        <span className="font-bold">
          <b>
            <span className="relative inline-block">
              <span className="underline decoration-primary underline-offset-8">
                SER
              </span>
            </span>
            VIÇOS
          </b>

        </span>
        {' '}
        MAIS POPULARES
      </Text>
      <span className="h-1 w-8 bg-white" />
      <div className="grid grid-cols-1 justify-between gap-8 sm:grid-cols-2 lg:grid-cols-4">

        {services.map((item, index) => (
          <div
            key={item.title}
          >
            <motion.div
              custom={index}
              initial="hidden"
              whileInView="visible"
              variants={cardVariants}
              className="size-full"
            >
              <Card className="group flex size-full flex-col gap-5 border border-secondaryDark bg-transparent" radius="md">
                <div className="flex flex-col gap-6">
                  <Text as="h5" className="whitespace-pre-line">{item.title}</Text>
                  <div className="mt-5 flex">
                    <item.icon className=" text-white group-hover:text-primary" size={36} />
                  </div>
                  <Text as="p" styleOverride="small" className="text-secondaryLighter">{item.description}</Text>
                </div>
              </Card>
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>

  );
};

export default ServicesList;
