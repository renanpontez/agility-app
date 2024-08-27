import type { Meta, StoryObj } from '@storybook/react';

import Loading from './Loading';

const meta: Meta<typeof Loading> = {
  title: 'Components/Loading',
  tags: ['autodocs'],
  component: Loading,
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'big', 'fullscreen', 'full'],
    },
    className: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Loading>;

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const Big: Story = {
  args: {
    size: 'big',
  },
};

export const Fullscreen: Story = {
  args: {
    size: 'fullscreen',
  },
};

export const Full: Story = {
  args: {
    size: 'full',
  },
};

export const CustomClass: Story = {
  args: {
    size: 'medium',
    className: 'text-error',
  },
};

export const CustomIconClass: Story = {
  args: {
    size: 'medium',
    iconClassName: 'fill-error',
  },
};
