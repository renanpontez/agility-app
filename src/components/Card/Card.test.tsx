import { render, screen } from '@testing-library/react';

import Card from './Card';

describe('Card Component', () => {
  it('renders correctly with default props', () => {
    render(
      <Card>
        <p>This is a card</p>
      </Card>,
    );

    const card = screen.getByText('This is a card');
    expect(card).toBeInTheDocument();
    expect(card.closest('div')).toHaveClass('bg-gray-800');
    expect(card.closest('div')).toHaveClass('rounded-lg');
  });

  it('renders with a small radius', () => {
    render(
      <Card radius="sm">
        <p>This is a card with small radius</p>
      </Card>,
    );

    const card = screen.getByText('This is a card with small radius');
    expect(card.closest('div')).toHaveClass('rounded-sm');
  });

  it('applies additional custom classes', () => {
    render(
      <Card className="shadow-lg">
        <p>This is a card with a shadow</p>
      </Card>,
    );

    const card = screen.getByText('This is a card with a shadow');
    expect(card.closest('div')).toHaveClass('shadow-lg');
  });
});
