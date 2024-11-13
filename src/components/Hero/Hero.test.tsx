import { render, screen } from '@testing-library/react';

import Hero from './Hero';

describe('Hero Component', () => {
  it('renders an image when mediaType is "image"', () => {
    render(
      <Hero
        mediaType="image"
        mediaSrc="/path/to/hero-image.jpg"
        style="full-height"
        altText="An amazing hero image"
      />,
    );

    const image = screen.getByAltText('An amazing hero image');
    expect(image).toBeInTheDocument();
    expect(image.tagName).toBe('IMG');
  });

  it('renders a video when mediaType is "video"', () => {
    render(
      <Hero
        mediaType="video"
        mediaSrc="/path/to/hero-video.mp4"
        style="auto-height"
        videoProps={{ autoPlay: true, loop: true, muted: true }}
      />,
    );

    const video = screen.getByRole('video');
    expect(video).toBeInTheDocument();
    expect(video.tagName).toBe('VIDEO');
  });

  it('applies the correct style based on the style prop', () => {
    render(
      <Hero
        mediaType="image"
        mediaSrc="/path/to/hero-image.jpg"
        style="full-height"
        altText="An amazing hero image"
      />,
    );

    const container = screen.getByAltText('An amazing hero image').closest('div');
    expect(container).toHaveClass('h-screen');
  });
});
