import { render, screen } from '@testing-library/react';

import LandingTemplate from './LandingTemplate';

describe('LandingTemplate', () => {
  it('renders the children content correctly', () => {
    render(
      <LandingTemplate>
        <div data-testid="content">
          <h1>Test Content</h1>
        </div>
      </LandingTemplate>,
    );

    const content = screen.getByTestId('content');
    expect(content).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders the Header and Footer components', () => {
    render(
      <LandingTemplate>
        <div>Page Content</div>
      </LandingTemplate>,
    );

    expect(screen.getByRole('banner')).toBeInTheDocument(); // Assuming Header has a role="banner"
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Assuming Footer has a role="contentinfo"
  });
});
