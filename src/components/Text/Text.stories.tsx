import type { Meta, StoryObj } from '@storybook/react';

import Text from './Text';

// Define metadata for the component story
const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  tags: ['autodocs'],
  component: Text,
  argTypes: {
    as: {
      control: { type: 'select' },
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'em', 'blockquote'],
    },
    decoration: {
      control: { type: 'radio' },
      options: ['italic', 'bold', 'strike', null],
    },
    className: {
      control: 'text',
    },
  },
};

export default meta;

// Define story templates
type Story = StoryObj<typeof Text>;

// Basic Story for Text Component
export const Basic: Story = {
  args: {
    as: 'p',
    decoration: undefined,
    children: 'This is a basic paragraph text.',
  },
};

// Bold Text Example
export const BoldText: Story = {
  args: {
    as: 'p',
    decoration: 'bold',
    children: 'This is a bold paragraph text.',
  },
};

// Italic Text Example
export const ItalicText: Story = {
  args: {
    as: 'p',
    decoration: 'italic',
    children: 'This is an italic paragraph text.',
  },
};

// Header Example
export const HeaderText: Story = {
  args: {
    as: 'h1',
    decoration: 'bold',
    children: 'This is a Header (H1) with bold text.',
  },
};

// Blockquote Example
export const BlockquoteText: Story = {
  args: {
    as: 'blockquote',
    decoration: undefined,
    children: 'This is a blockquote.',
  },
};
