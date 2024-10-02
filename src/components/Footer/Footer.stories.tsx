import type { Meta, StoryObj } from '@storybook/react';

import Footer from '@/components/Footer';

const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  tags: ['autodocs'],
  component: Footer,
  argTypes: {
  },
};

export default meta;

type Story = StoryObj<typeof Footer>;

export const Primary: Story = {
  args: {
  },
};
