import { render, screen } from '@testing-library/react';

import Header from './Header';

describe('Header Component', () => {
  it('should render the logo', () => {
    render(<Header style="light" />);
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
  });

  it('should render 5 navigation links', () => {
    render(<Header style="light" />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(5);
  });

  it('should apply dark background when style is dark', () => {
    render(<Header style="dark" />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-black');
  });

  it('should apply shadow when isScrolled is true', () => {
    render(<Header style="light" />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('shadow-md');
  });
});
