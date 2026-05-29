import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import Header from './Header';

// Force the desktop branch of the header so navigation + logo render predictably.
vi.mock('@/hooks/useBreakpoint', () => ({
  useBreakpoint: () => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isWidescreen: false,
  }),
}));

describe('Header Component', () => {
  it('renders the homepage link with the logo', () => {
    render(<Header style="light" />);
    const homeLinks = screen.getAllByLabelText(/Agility Homepage/i);
    expect(homeLinks.length).toBeGreaterThan(0);
  });

  it('renders the 4 main navigation links', () => {
    render(<Header style="light" />);
    // 1 logo link + 4 MENU_ITEMS = 5 links rendered in the desktop layout.
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(5);
  });

  it('applies the light style classes when style is "light"', () => {
    render(<Header style="light" />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-white');
    expect(header).toHaveClass('text-black');
  });

  it('applies the dark style classes when style is "dark"', () => {
    render(<Header style="dark" />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-black');
    expect(header).toHaveClass('text-white');
  });
});
