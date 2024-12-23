import type { Meta, StoryObj } from '@storybook/react';

import BreadCrumb from '@/components/Atoms/BreadCrumb';

const meta: Meta<typeof BreadCrumb> = {
  title: 'Components/BreadCrumb',
  tags: ['autodocs'],
  component: BreadCrumb,
  argTypes: {
    style: {
      control: 'select',
      options: ['primary', 'secondary', 'white', 'dark'],
    },
    size: { control: 'select', options: ['xs', 'md', 'lg'] },
    items: {
      control: 'object',
      description: 'Array de objetos com um nome e um href',
      table: {
        type: {
          summary: 'Array<{name: string. href:string}>',
        },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof BreadCrumb>;

export const Default: Story = {
  args: {
    style: 'dark',
    size: 'xs',
    items: [{
      name: 'Home',
      href: '/',
    }, {
      name: 'Portfolio',
      href: '/portfolio',
    }, {
      name: 'Mr-adv',
      href: '',
    }],
  },
};
