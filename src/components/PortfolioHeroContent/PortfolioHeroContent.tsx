import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import type React from 'react';

import Text from '@/components/Text';

type PortfolioHeroContentProps = {
  projectName: string;
  tags?: StaticImageData[];
};

const PortfolioHeroContent: React.FC<PortfolioHeroContentProps> = ({ projectName, tags }) => {
  return (
    <div className="mb-8 mt-28 flex h-full flex-col gap-10 md:justify-center md:gap-10 lg:mx-auto">
      <Text
        as="h1"
        styleOverride="h2"
        className="text-center font-normal !leading-snug tracking-wider text-white md:font-light lg:text-left"
      >
        Resumo do Projeto:
        <br />
        {' '}
        <span className="font-semibold">
          {projectName.toUpperCase()}
        </span>
      </Text>
      <div className="flex flex-wrap justify-center gap-2 md:justify-start md:gap-8">
        {tags
        && tags.map((tag, index) => (
          <Image
            key={index}
            src={tag}
            alt={`Tag-${index}`}
            width={190}
            height={42}
          />
        ))}
      </div>
    </div>
  );
};

export default PortfolioHeroContent;
