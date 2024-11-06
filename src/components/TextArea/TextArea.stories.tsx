import type { Meta, StoryObj } from '@storybook/react';

import TextArea from './TextArea';

const meta: Meta<typeof TextArea> = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
    isInvalid: {
      control: 'boolean',
    },
    rows: {
      control: { type: 'number', min: 1 },
    },
    className: {
      control: 'text',
    },
    onChange: {
      action: 'changed',
    },
  },
  args: {
    value: '',
    placeholder: 'Enter your message here...',
    isInvalid: false,
    rows: 4,
  },
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  args: {
    value: '',
    placeholder: 'Enter your message here...',
    isInvalid: false,
  },
};

export const Invalid: Story = {
  args: {
    value: '',
    placeholder: 'Enter your message here...',
    isInvalid: true,
  },
};

export const CustomRows: Story = {
  args: {
    value: 'This is a textarea with custom rows.',
    placeholder: '',
    isInvalid: false,
    rows: 6,
  },
};
