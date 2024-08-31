import classNames from 'classnames';
import NextLink from 'next/link';
import React from 'react';

export type LinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

const Link: React.FC<LinkProps> = ({ href, className, children }) => {
  const isExternalUrl = /^https?:\/\//.test(href);
  const Tag = isExternalUrl ? 'a' : NextLink;

  return (
    <Tag
      href={href}
      className={classNames('', className)}
      target={isExternalUrl ? '_blank' : '_self'}
      {...(isExternalUrl && { rel: 'noopener noreferrer' })}
    >
      {children}
    </Tag>
  );
};

export default Link;
