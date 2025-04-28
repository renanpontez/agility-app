'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { FaChartColumn, FaComputer, FaEnvelopesBulk } from 'react-icons/fa6';

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
      icon: FaComputer,
      title: 'Sites/Landing Pages',
      description: 'Sites que realmente entregam resultados para seu projeto',
    },
    {
      icon: FaEnvelopesBulk,
      title: 'Aplicativos/Jogos Digitais',
      description: 'Apps e jogos personalizados transformados em realidade',
    },
    {
      icon: FaChartColumn,
      title: 'Lojas Virtuais/E-commerce',
      description: 'Aproveite a expansão do mercado com vendas online',
    },
    {
      icon: FaChartColumn,
      title: 'Consultoria Dev Tecnologia',
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

      <Text as="h3" className="mb-10">
        <b>SERVIÇOS</b>
        {' '}
        MAIS POPULARES
      </Text>
      <div className="flex flex-col justify-between gap-8 md:flex-row">

        {services.map((item, index) => (
          <div
            className="w-full"
            key={item.title}
          >
            <motion.div
              custom={index}
              initial="hidden"
              whileInView="visible"
              variants={cardVariants}
            >
              <Card className="flex w-full flex-col gap-5 border border-secondaryDark bg-transparent p-6">
                <div className="flex flex-col gap-6">
                  <Text as="h5" className="w-36">{item.title}</Text>
                  <div className="mt-6 flex">
                    <item.icon className="text-white hover:text-primary" size={36} />
                  </div>
                  <Text as="p" className="text-secondaryLighter">{item.description}</Text>
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
