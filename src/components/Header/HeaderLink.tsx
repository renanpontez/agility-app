import {
  Link,
  Text,
} from 'agility-wind';
import React from 'react';

type HeaderLinkProps = {
  href: string;
  text: string;
};

const HeaderLink: React.FC<HeaderLinkProps> = ({ href, text }) => {
  return (
    <Link href={href}>
      <Text as="p" className="border-b border-transparent text-sm font-semibold transition duration-300 ease-in-out hover:border-b hover:border-primary">{text}</Text>
    </Link>
  );
};

export default HeaderLink;
