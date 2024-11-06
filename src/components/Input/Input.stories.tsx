import type { Meta, StoryObj } from '@storybook/react';

import Input from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  tags: ['autodocs'],
  component: Input,
  argTypes: {
    isInvalid: { control: 'boolean' },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    className: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const Invalid: Story = {
  args: {
    isInvalid: true,
    placeholder: 'Invalid input...',
  },
};

export const WithCustomClass: Story = {
  args: {
    placeholder: 'Custom class...',
    className: 'text-red-500 bg-gray-100',
  },
};
