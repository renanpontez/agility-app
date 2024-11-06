import type { Meta, StoryObj } from '@storybook/react';

import Card from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    radius: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
    className: {
      control: 'text',
    },
    children: {
      control: 'text',
    },
  },
  args: {
    radius: 'lg',
    children: 'This is a card with default radius and dark background.',
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    radius: 'lg',
    children: 'This is a card with default radius and dark background.',
  },
};

export const SmallRadius: Story = {
  args: {
    radius: 'sm',
    children: 'This is a card with a small radius.',
  },
};

export const CustomClass: Story = {
  args: {
    radius: 'lg',
    className: 'shadow-lg',
    children: 'This card has a shadow and uses the default large radius.',
  },
};
