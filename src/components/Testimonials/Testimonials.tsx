import React from 'react';

import Text from '@/components/Text';

const Testimonials: React.FC = () => {
  return (
    <>
      <Text as="h2">
        O QUE NOSSOS CLIENTES FALAM
      </Text>
      <div className="relative">
        <div className="absolute -left-5 -top-5">
          <Text as="p" className="font-serif text-5xl italic text-primaryLighter">"</Text>
        </div>
        <div className="mt-8 flex w-fit flex-col gap-2 px-5 ">
          <Text as="p" className="tracking-wider">
            Nossa presença digital foi transformada com um site que superou expectativas. O resultado impulsionou nossos negócios, e a experiência com a equipe foi excepcional!
          </Text>
          <Text as="em" className="text-secondaryLighter">
            Leandro P | Agillock Gestão de Risco
          </Text>
        </div>
        <div className="absolute -bottom-10 -right-5">
          <Text as="p" className="font-serif text-5xl italic text-primaryLighter">"</Text>
        </div>
      </div>
    </>
  );
};

export default Testimonials;
