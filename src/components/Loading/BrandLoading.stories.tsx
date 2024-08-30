import type { Meta, StoryObj } from '@storybook/react';

import { BrandLoading } from '.';

const meta: Meta<typeof BrandLoading> = {
  title: 'Components/Loading/BrandLoading',
  tags: ['autodocs'],
  component: BrandLoading,
  argTypes: {
    className: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof BrandLoading>;

export const Generic: Story = {
  args: {
  },
};

export const CustomClassName: Story = {
  args: {
    className: 'w-[200px] h-[200px]',
  },
};
