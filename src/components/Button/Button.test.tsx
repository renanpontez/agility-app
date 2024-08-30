import { fireEvent, render, screen } from '@testing-library/react';

import { Button } from '@/components/Button';

describe('Button component', () => {
  it('should render the button with primary style', () => {
    render(
      <Button style="primary" onClick={() => { }}>
        Primary Button
      </Button>,
    );

    const buttonElement = screen.getByRole('button', { name: /Primary Button/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('bg-primary');
  });

  it('should render the button with secondary style', () => {
    render(
      <Button style="secondary" onClick={() => { }}>
        Secondary Button
      </Button>,
    );

    const buttonElement = screen.getByRole('button', { name: /Secondary Button/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('bg-secondary');
  });

  it('should call the onClick handler when clicked', () => {
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };

    render(
      <Button style="primary" onClick={handleClick}>
        Click Me
      </Button>,
    );

    const buttonElement = screen.getByRole('button', { name: /Click Me/i });
    fireEvent.click(buttonElement);

    expect(clicked).toBe(true);
  });
});
