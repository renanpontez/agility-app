import type { Meta, StoryObj } from '@storybook/react';

import Hero from './Hero';

const meta: Meta<typeof Hero> = {
  title: 'Components/Hero',
  component: Hero,
  tags: ['autodocs'],
  argTypes: {
    mediaType: {
      control: { type: 'radio' },
      options: ['image', 'video'],
    },
    style: {
      control: { type: 'radio' },
      options: ['full-height', 'auto-height'],
    },
    className: {
      control: 'text',
    },
    mediaSrc: {
      control: 'text',
    },
    altText: {
      control: 'text',
    },
  },
  args: {
    mediaType: 'image',
    mediaSrc: '/path/to/hero-image.jpg',
    style: 'full-height',
    altText: 'An amazing hero image',
  },
};

export default meta;
type Story = StoryObj<typeof Hero>;

export const ImageHero: Story = {
  args: {
    mediaType: 'image',
    mediaSrc: '/path/to/hero-image.jpg',
    style: 'full-height',
    altText: 'An amazing hero image',
  },
};

export const VideoHero: Story = {
  args: {
    mediaType: 'video',
    mediaSrc: 'https://cdn2.hubspot.net/hubfs/6436815/home-video.mp4',
    style: 'auto-height',
    videoProps: { autoPlay: true, loop: true, muted: true },
  },
};
