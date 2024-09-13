import type { Meta, StoryObj } from '@storybook/react';
import { Button } from 'agility-wind';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  tags: ['autodocs'],
  component: Button,
  argTypes: {
    style: {
      control: 'select',
      options: ['primary', 'secondary', 'light', 'dark', 'link', 'warning', 'error'],
    },
    icon: { control: 'text' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    style: 'primary',
    children: 'Continue',
  },
};

export const Secondary: Story = {
  args: {
    style: 'secondary',
    children: 'Continue',
  },
};

export const Light: Story = {
  args: {
    style: 'light',
    children: 'Cancel',
  },
};

export const Dark: Story = {
  args: {
    style: 'dark',
    children: 'Cancel',
  },
};

export const Link: Story = {
  args: {
    style: 'link',
    children: 'Learn more',
  },
};

export const Warning: Story = {
  args: {
    style: 'warning',
    children: 'Warning',
  },
};

export const Error: Story = {
  args: {
    style: 'error',
    children: 'Error',
  },
};

export const WithIcon: Story = {
  args: {
    style: 'primary',
    children: 'Login with Email',
    icon: '📧',
  },
};

export const Loading: Story = {
  args: {
    style: 'primary',
    children: 'Loading...',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    style: 'primary',
    children: 'Disabled',
    disabled: true,
  },
};
