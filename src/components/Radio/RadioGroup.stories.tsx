import type { Meta, StoryObj } from '@storybook/react';

import RadioGroup from './RadioGroup';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  tags: ['autodocs'],
  component: RadioGroup,
  argTypes: {
    defaultValue: { control: 'text' },
    options: { control: 'object', options: [
      {
        id: { control: 'text' },
        value: { control: 'text' },
        label: { control: 'text' },
      },
    ] },
    style: { control: 'select', options: ['primary', 'secondary'] },
  },
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Primary: Story = {
  args: {
    defaultValue: '1',
    options: [
      { id: '1', label: 'teste1', value: '1' },
      { id: '2', label: 'teste2', value: '2' },
      { id: '3', label: 'teste3', value: '3' },
    ],
    style: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    defaultValue: '2',
    options: [
      { id: '1', label: 'teste1', value: '1' },
      { id: '2', label: 'teste2', value: '2' },
      { id: '3', label: 'teste3', value: '3' },
    ],
    style: 'secondary',
  },
};
