import classNames from 'classnames';
import Image from 'next/image';
import React from 'react';

const LogoNameBlack = '/assets/images/logo/logo_name_black.svg';
const LogoNamePrimary = '/assets/images/logo/logo_name_primary.svg';
const LogoNameWhite = '/assets/images/logo/logo_name_white.svg';
const LogoSloganBlack = '/assets/images/logo/logo_slogan_black.svg';
const LogoSloganPrimary = '/assets/images/logo/logo_slogan_primary.svg';
const LogoSloganWhite = '/assets/images/logo/logo_slogan_white.svg';
const LogoSymbolBlack = '/assets/images/logo/logo_symbol_black.svg';
const LogoSymbolPrimary = '/assets/images/logo/logo_symbol_primary.svg';
const LogoSymbolWhite = '/assets/images/logo/logo_symbol_white.svg';

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
      <Image src={SymbolSrc} alt="Logo Symbol" width={50} height={0} />
      {showName && (
        <div
          className={classNames('flex items-center', {
            'flex-col mt-2': style === 'standard',
            'flex-row ml-2': style === 'horizontal',
          })}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Image src={NameSrc} alt="Agility Creative" width={150} height={0} />
            {showSlogan && (
              <Image
                width={150}
                height={0}
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
