import {
  Link,
} from 'agility-wind';
import React from 'react';

import { SOCIAL_NETWORKS } from '@/utils/Constants';

const SocialIcons: React.FC = () => {
  return (
    <>
      {SOCIAL_NETWORKS.map(item => (
        <Link
          key={item.title}
          href={item.href}
          className="text-secondaryLight transition-colors duration-300 hover:text-secondaryLighter"
          aria-label={item.title}
        >
          <item.icon size={16} />
        </Link>
      ))}
    </>
  );
};

export default SocialIcons;
