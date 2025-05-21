import React from 'react';

type PortfolioItemProps = {
  imageSrc?: string;
  title: string;
  description?: string;
  href?: string;
  linkPropsOverride?: Record<string, string>;
};

const PortfolioItem: React.FC<PortfolioItemProps> = ({ imageSrc, title, description, href, linkPropsOverride }) => {
  const Tag = href ? 'a' : 'div';

  const linkProps = {
    target: '_blank',
    rel: 'noopener noreferrer',
    href,
    ...linkPropsOverride,
  };

  return (
    <Tag
      className="group relative flex aspect-square items-end rounded-lg bg-secondaryDark shadow transition-shadow hover:shadow-lg"
      style={{
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      {...(href && linkProps)}
    >
      <div className="relative z-0 flex justify-end transition duration-500 ease-in-out">
        <div className="border-left-rounded-lg border-right-rounded-lg relative z-20 flex flex-col justify-end bg-secondaryDarker bg-opacity-90 p-4 text-left opacity-0 transition group-hover:opacity-100">
          <h3 className="text-lg font-semibold text-white ">{title}</h3>
          {description && <p className="mt-1 text-sm text-secondaryLighter">{description}</p>}
        </div>
      </div>
    </Tag>
  );
};

export default PortfolioItem;
