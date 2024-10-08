import type { Meta, StoryObj } from '@storybook/react';

import Header from './Header';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  argTypes: {
    style: {
      control: 'select',
      options: ['light', 'dark', 'transparent'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Light: Story = {
  args: {
    style: 'light',
  },
};

export const Dark: Story = {
  args: {
    style: 'dark',
  },
};

export const Transparent: Story = {
  args: {
    style: 'transparent',
  },
};

export const Scrolled: Story = {
  args: {
    style: 'dark',
  },
};
