import type { Meta, StoryObj } from '@storybook/react';

import Logo from './Logo';

const meta: Meta<typeof Logo> = {
  title: 'Components/Logo',
  component: Logo,
  tags: ['autodocs'],
  argTypes: {
    style: {
      control: { type: 'radio' },
      options: ['standard', 'horizontal'],
    },
    symbolColor: {
      control: { type: 'radio' },
      options: ['primary', 'white', 'black'],
    },
    nameSloganColor: {
      control: { type: 'radio' },
      options: ['primary', 'white', 'black'],
    },
    showName: {
      control: { type: 'boolean' },
    },
    showSlogan: {
      control: { type: 'boolean' },
    },
  },
  args: {
    style: 'horizontal',
    symbolColor: 'primary',
    nameSloganColor: 'white',
    showName: true,
    showSlogan: true,
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  args: {
    style: 'horizontal',
    symbolColor: 'primary',
    nameSloganColor: 'white',
    showName: true,
    showSlogan: true,
  },
};

export const Standard: Story = {
  args: {
    style: 'standard',
    symbolColor: 'white',
    nameSloganColor: 'black',
    showName: true,
    showSlogan: false,
  },
};

export const WithoutSlogan: Story = {
  args: {
    style: 'horizontal',
    symbolColor: 'black',
    nameSloganColor: 'primary',
    showName: true,
    showSlogan: false,
  },
};

export const SymbolOnly: Story = {
  args: {
    style: 'horizontal',
    symbolColor: 'primary',
    nameSloganColor: 'white',
    showName: false,
  },
};
