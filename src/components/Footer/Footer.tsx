import React from 'react';

import Link from '@/components/Link';
import SocialIcons from '@/components/SocialIcons/SocialIcons';

import Logo from '../Logo';
import Text from '../Text';

const FooterLink = ({
  href = '/',
  text,
}: {
  href?: string;
  text: string;
  external?: boolean;
}) => (
  <Link href={href}>
    <Text as="p" className="text-xs text-secondaryLighter hover:text-white">{text}</Text>
  </Link>
);

const Footer: React.FC = () => {
  return (
    <footer>
      <div className=" bg-secondaryEvenDarker py-10 text-xs text-secondary">
        <div className="container flex flex-col justify-between gap-8 py-10 md:flex-row md:gap-0">
          <div className="flex flex-col gap-5">
            <Logo
              showName
              showSlogan
              symbolColor="primary"
              nameSloganColor="white"
              style="horizontal"
              size="sm"
            />
            <Text as="p" className="w-2/3 text-xs text-secondaryLighter">
              Soluções que inspiram.
              <br />
              Transformando ideias em experiências únicas e poderosas.
            </Text>
          </div>
          <div className="flex flex-col gap-5">
            <Text as="h4" styleOverride="h6" className=" text-white">Redes Sociais</Text>
            <div className="flex flex-row gap-3">
              <SocialIcons />
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <Text as="h4" styleOverride="h6" className="">Sitemap</Text>
            <div className="flex flex-col gap-2">
              <FooterLink text="Início" href="/" />
              <FooterLink text="Sobre nós" href="/sobre-nos" />
              <FooterLink text="Nossos serviços" href="/sobre-nos#Servicos" />
              <FooterLink text="Portfolio" href="/#Portfolio" />
              <FooterLink text="Entre em contato" href="/#Contato" />
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <Text as="h4" styleOverride="h6" className=" text-white">Vamos voar juntos?</Text>
            <div className="flex flex-col gap-2">
              <FooterLink text="hi@agilitycreative.com" href="mailto:hi@agilitycreative.com" />
              <FooterLink text="+55 85 99628-4730" href="phone:+5585996284730" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full border-t border-secondaryDarker bg-secondaryEvenDarker py-5 text-center text-xs">
        <Text as="p" size="xs" className="text-secondaryLight">© 2021 Agility Creative. Todos os direitos reservados.</Text>
      </div>
    </footer>

  );
};

export default Footer;
