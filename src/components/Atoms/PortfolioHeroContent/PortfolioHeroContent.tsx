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
    <div className="mx-auto mb-8 mt-16 flex flex-col justify-end gap-10 md:mt-40 md:justify-end md:gap-20 lg:mx-0">
      <Text
        as="h1"
        styleOverride="h1"
        className="text-center text-xl font-normal !leading-snug tracking-wider text-white sm:text-3xl md:font-light lg:text-left lg:text-5xl"
      >
        Veja como foi a
        <br />
        construção do site
        <br />
        da
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
