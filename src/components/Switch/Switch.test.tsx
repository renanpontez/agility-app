import { render, screen } from '@testing-library/react';

import Switch from './Switch';

describe('Switch', () => {
  it('renders the provided label', () => {
    render(
      <Switch
        style="primary"
        size="md"
        checked={false}
        onClick={() => {}}
        label="Notifications"
      />,
    );

    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('renders as a button element so it is keyboard-reachable', () => {
    render(
      <Switch
        style="primary"
        size="md"
        checked
        onClick={() => {}}
      />,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies the primary background when checked', () => {
    render(
      <Switch
        style="primary"
        size="md"
        checked
        onClick={() => {}}
        label="On"
      />,
    );

    const button = screen.getByRole('button');
    // Inner div carries the bg-primary class when checked
    expect(button.querySelector('.bg-primary')).not.toBeNull();
  });
});
