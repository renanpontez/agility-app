import { fireEvent, render, screen } from '@testing-library/react';

import Input from './Input';

describe('Input component', () => {
  it('should render with default styles', () => {
    render(<Input placeholder="Enter text..." />);
    const inputElement = screen.getByPlaceholderText(/Enter text.../i);
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveClass('border-gray-300');
  });

  it('should apply invalid styles', () => {
    render(<Input isInvalid placeholder="Invalid input..." />);
    const inputElement = screen.getByPlaceholderText(/Invalid input.../i);
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveClass('border-red-500');
  });

  it('should update value when typing', () => {
    let value = '';
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      value = e.target.value;
    };

    render(<Input onChange={handleChange} />);
    const inputElement = screen.getByRole('textbox');
    fireEvent.change(inputElement, { target: { value: 'Hello' } });
    expect(value).toBe('Hello');
  });

  it('should handle focus event', () => {
    let focused = false;
    const handleFocus = () => {
      focused = true;
    };

    render(<Input onFocus={handleFocus} />);
    const inputElement = screen.getByRole('textbox');
    fireEvent.focus(inputElement);
    expect(focused).toBe(true);
  });
});
