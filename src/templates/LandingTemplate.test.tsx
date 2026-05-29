import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import LandingTemplate from './LandingTemplate';

// Header and Footer are lazy-loaded inside LandingTemplate which keeps
// the test stuck on the Suspense fallback. Mock them out so the template
// renders synchronously.
vi.mock('@/components/Header', () => ({
  default: () => <header role="banner">Header</header>,
}));
vi.mock('@/components/Footer', () => ({
  default: () => <footer role="contentinfo">Footer</footer>,
}));

describe('LandingTemplate', () => {
  it('renders the children content correctly', async () => {
    render(
      <LandingTemplate>
        <div data-testid="content">
          <h1>Test Content</h1>
        </div>
      </LandingTemplate>,
    );

    const content = await screen.findByTestId('content');
    expect(content).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders the Header and Footer components', async () => {
    render(
      <LandingTemplate>
        <div>Page Content</div>
      </LandingTemplate>,
    );

    expect(await screen.findByRole('banner')).toBeInTheDocument();
    expect(await screen.findByRole('contentinfo')).toBeInTheDocument();
  });
});
