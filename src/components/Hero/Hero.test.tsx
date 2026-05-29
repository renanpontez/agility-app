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

  it('renders fallback poster image when mediaType is "video" on mobile viewport', () => {
    // In jsdom, matchMedia is stubbed to return matches=false, so the
    // mobile branch renders the poster Image instead of the lazy video.
    render(
      <Hero
        mediaType="video"
        mediaSrc="/path/to/hero-video.mp4"
        style="auto-height"
        videoProps={{ autoPlay: true, loop: true, muted: true }}
      />,
    );

    const fallback = screen.getByAltText(/Hero Image/i);
    expect(fallback).toBeInTheDocument();
  });

  it('applies the full-height class to the outer container when style is "full-height"', () => {
    const { container } = render(
      <Hero
        mediaType="image"
        mediaSrc="/path/to/hero-image.jpg"
        style="full-height"
        altText="An amazing hero image"
      />,
    );

    // Outer animated.div is the first child of the test container.
    expect(container.firstChild).toHaveClass('h-screen');
  });
});
