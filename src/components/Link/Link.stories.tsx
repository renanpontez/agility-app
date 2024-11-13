import type { Meta, StoryObj } from '@storybook/react';

import Link from './Link';

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    href: {
      control: 'text',
    },
    className: {
      control: 'text',
    },
    children: {
      control: 'text',
    },
  },
  args: {
    href: '/about',
    children: 'Go to About Page',
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const InternalLink: Story = {
  args: {
    href: '/about',
    children: 'Go to About Page',
  },
};

export const ExternalLink: Story = {
  args: {
    href: 'https://example.com',
    children: 'Visit Example.com',
  },
};

export const CustomClassLink: Story = {
  args: {
    href: '/about',
    className: 'text-red-500 font-bold',
    children: 'Go to About Page with custom styling',
  },
};
