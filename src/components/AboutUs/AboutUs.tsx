'use client';

import Text from '../Text';

const AboutUs = () => {
  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
      <div className="w-full lg:w-1/2">
        <Text as="h3" className="text-[28px] font-semibold leading-snug">
          Construindo soluções que transformam o futuro.
        </Text>
      </div>

      <div className="flex w-full flex-col gap-6 lg:w-1/2">
        <Text as="p" className="text-lg leading-7">
          A gente acredita que organizando o processo criativo e trabalhando em
          parceria com o cliente, conseguimos multiplicar os resultados do seu
          projeto.
        </Text>

        <Text as="p" className="text-lg leading-7">
          A Agility tem como meta entregar sempre mais do que o esperado. Nós
          seremos uma parceria leve que vai te levar para mais perto do sucesso
          do seu projeto!
        </Text>

        <a href="/sobre-nos" className="w-fit text-xs font-semibold text-primaryLight hover:underline">
          Saiba mais
        </a>
      </div>
    </div>
  );
};

export default AboutUs;
