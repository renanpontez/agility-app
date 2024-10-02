import type { Meta, StoryObj } from '@storybook/react';

import PortfolioItem from '@/components/Portfolio/PortfolioItem';

const meta: Meta<typeof PortfolioItem> = {
  title: 'Components/PortfolioItem',
  tags: ['autodocs'],
  component: PortfolioItem,
  argTypes: {
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    href: {
      control: 'text',
    },
    imageSrc: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof PortfolioItem>;

export const Primary: Story = {
  args: {
    title: 'Agility Creative',
    description: 'Soluções digitais',
    href: 'https://www.agilitycreative.com/',
    imageSrc: 'https://www.agilitycreative.com/assets/images/logo/logo_symbol_primary.svg',
  },
};
