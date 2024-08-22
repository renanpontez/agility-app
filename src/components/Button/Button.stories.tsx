import type { Meta, StoryObj } from '@storybook/react';

import Button from './';

// Define metadata for the component story
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' }, // Adds an action logger for the onClick event
    style: {
      control: { type: 'radio' },
      options: ['primary', 'secondary'],
    },
  },
};

export default meta;

// Define story templates
type Story = StoryObj<typeof Button>;

// Primary Button
export const Primary: Story = {
  args: {
    style: 'primary',
    children: 'Primary Button',
  },
};

// Secondary Button
export const Secondary: Story = {
  args: {
    style: 'secondary',
    children: 'Secondary Button',
  },
};
