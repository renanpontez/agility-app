import type { Meta, StoryObj } from '@storybook/react';

import CheckBox from './CheckBox';

const meta: Meta<typeof CheckBox> = {
  title: 'Components/CheckBox',
  tags: ['autodocs'],
  component: CheckBox,
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
    subLabel: { control: 'text' },
    checked: { control: 'boolean' },
    icon: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof CheckBox>;

export const Primary: Story = {
  args: {
    style: 'primary',
    size: 'sm',
    label: 'Accept terms and condition',
    subLabel: 'You agree to our Terms of Service and Privacy Policy.',
  },
};

export const Secondary: Story = {
  args: {
    style: 'secondary',
    size: 'lg',
    label: 'Accept terms and condition',
  },
};
