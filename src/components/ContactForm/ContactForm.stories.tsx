import type { Meta, StoryObj } from '@storybook/react';

import ContactForm from './ContactForm';

const meta: Meta<typeof ContactForm> = {
  title: 'Components/ContactForm',
  component: ContactForm,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="bg-gray-100 p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ContactForm>;

export const Default: Story = {};
