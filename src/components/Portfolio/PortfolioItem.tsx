import React from 'react';

type PortfolioItemProps = {
  imageSrc: string;
  title: string;
  description?: string;
  href?: string;
};

const PortfolioItem: React.FC<PortfolioItemProps> = ({ imageSrc, title, description, href }) => {
  const Tag = href ? 'a' : 'div';

  const linkProps = {
    target: '_blank',
    rel: 'noopener noreferrer',
    href,
  };

  return (
    <Tag
      className="relative block aspect-square rounded-lg bg-secondaryDark shadow transition-shadow hover:shadow-lg"
      style={{
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      {...(href && linkProps)}
    >
      <div className="relative z-0 size-full opacity-0 transition duration-500 ease-in-out hover:opacity-100">
        {/* TODO: FIX THIS */}
        {/* eslint-disable-next-line tailwindcss/migration-from-tailwind-2 */}
        <div className="absolute inset-0 z-10 size-full rounded-lg bg-secondaryEvenDarker bg-opacity-50 transition duration-500 ease-in-out" />
        <div className="relative z-20 flex size-full flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {description && <p className="mt-1 text-sm text-gray-400">{description}</p>}
        </div>
      </div>
    </Tag>
  );
};

export default PortfolioItem;
