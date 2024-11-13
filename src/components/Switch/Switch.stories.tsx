import type { Meta, StoryObj } from '@storybook/react';

import Switch from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  tags: ['autodocs'],
  component: Switch,
  argTypes: {
    style: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    label: { control: 'text' },
    checked: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Primary: Story = {
  args: {
    style: 'primary',
    size: 'lg',
    label: 'Lorem Ipsum',
  },
};

export const Secondary: Story = {
  args: {
    style: 'secondary',
    size: 'lg',
    label: 'Lorem Ipsum',
  },
};
