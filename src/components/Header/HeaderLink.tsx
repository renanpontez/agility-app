import React from 'react';

import Text from '@/components/Text';

type HeaderLinkProps = {
  href: string;
  text: string;
};

const HeaderLink: React.FC<HeaderLinkProps> = ({ href, text }) => {
  return (
    <a href={href}>
      <Text as="p" className="border-b border-transparent text-sm font-semibold transition duration-300 ease-in-out hover:border-b hover:border-primary">{text}</Text>
    </a>
  );
};

export default HeaderLink;
