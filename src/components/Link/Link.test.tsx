import { render, screen } from '@testing-library/react';

import Link from './Link';

describe('Link Component', () => {
  it('renders a Next.js link when the URL is internal', () => {
    render(<Link href="/about">Go to About Page</Link>);

    const link = screen.getByText('Go to About Page');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/about');
    expect(link).not.toHaveAttribute('target', '_blank');
  });

  it('renders an anchor tag for external links', () => {
    render(<Link href="https://example.com">Visit Example.com</Link>);

    const link = screen.getByText('Visit Example.com');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('applies custom classes', () => {
    render(<Link href="/about" className="text-red-500">Go to About Page</Link>);

    const link = screen.getByText('Go to About Page');
    expect(link).toHaveClass('text-red-500');
  });
});
