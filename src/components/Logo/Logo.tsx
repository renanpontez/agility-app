import classNames from 'classnames';
import Image from 'next/image';
import React from 'react';

import LogoNameBlack from '@/public/assets/images/logo/logo_name_black.svg';
import LogoNamePrimary from '@/public/assets/images/logo/logo_name_primary.svg';
import LogoNameWhite from '@/public/assets/images/logo/logo_name_white.svg';
import LogoSloganBlack from '@/public/assets/images/logo/logo_slogan_black.svg';
import LogoSloganPrimary from '@/public/assets/images/logo/logo_slogan_primary.svg';
import LogoSloganWhite from '@/public/assets/images/logo/logo_slogan_white.svg';
import LogoSymbolBlack from '@/public/assets/images/logo/logo_symbol_black.svg';
import LogoSymbolPrimary from '@/public/assets/images/logo/logo_symbol_primary.svg';
import LogoSymbolWhite from '@/public/assets/images/logo/logo_symbol_white.svg';

type LogoProps = {
  style?: 'standard' | 'horizontal';
  symbolColor?: 'primary' | 'white' | 'black';
  nameSloganColor?: 'primary' | 'white' | 'black';
  showName?: boolean;
  showSlogan?: boolean;
};

const Logo: React.FC<LogoProps> = ({
  style = 'standard',
  symbolColor = 'primary',
  nameSloganColor = 'primary',
  showName = false,
  showSlogan = false,
}) => {
  const SymbolSrc = {
    primary: LogoSymbolPrimary,
    white: LogoSymbolWhite,
    black: LogoSymbolBlack,
  }[symbolColor];

  const NameSrc = {
    primary: LogoNamePrimary,
    white: LogoNameWhite,
    black: LogoNameBlack,
  }[nameSloganColor];

  const SloganSrc = {
    primary: LogoSloganPrimary,
    white: LogoSloganWhite,
    black: LogoSloganBlack,
  }[nameSloganColor];

  return (
    <div
      className={classNames('flex items-center w-fit gap-2', {
        'flex-col': style === 'standard',
        'flex-row': style === 'horizontal',
      })}
    >
      <Image src={SymbolSrc} alt="Logo Symbol" className="size-12" />
      {showName && (
        <div
          className={classNames('flex items-center', {
            'flex-col mt-2': style === 'standard',
            'flex-row ml-2': style === 'horizontal',
          })}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Image src={NameSrc} alt="Agility Creative" width={150} />
            {showSlogan && (
              <Image
                width={150}
                src={SloganSrc}
                alt="Creative - Digital - Innovation"
                className={classNames({})}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
