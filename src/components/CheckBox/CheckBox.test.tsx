import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import CheckBox from './CheckBox';

describe('CheckBox', () => {
  it('renders the label and sub label', () => {
    render(
      <CheckBox
        style="primary"
        size="md"
        label="Agree to terms"
        subLabel="You must accept to continue"
        className=""
        checked={false}
        onClick={() => {}}
      />,
    );

    expect(screen.getByText('Agree to terms')).toBeInTheDocument();
    expect(screen.getByText('You must accept to continue')).toBeInTheDocument();
  });

  it('calls onClick when toggled', () => {
    const onClick = vi.fn();
    render(
      <CheckBox
        style="primary"
        size="md"
        label="Subscribe"
        className=""
        checked={false}
        onClick={onClick}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Subscribe/i }));
    expect(onClick).toHaveBeenCalled();
  });

  it('reflects the checked state on the underlying input', () => {
    render(
      <CheckBox
        style="primary"
        size="md"
        label="Active"
        className=""
        checked
        onClick={() => {}}
      />,
    );

    const input = screen.getByRole('checkbox', { hidden: true }) as HTMLInputElement;
    expect(input).toBeChecked();
  });
});
