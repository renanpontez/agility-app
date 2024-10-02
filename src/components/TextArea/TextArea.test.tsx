import { fireEvent, render, screen } from '@testing-library/react';

import TextArea from './TextArea';

describe('Textarea Component', () => {
  it('renders with the correct placeholder', () => {
    render(<TextArea placeholder="Enter your message here" />);
    const textarea = screen.getByPlaceholderText('Enter your message here');
    if (!textarea) {
      throw new Error('Textarea not found');
    }
  });

  it('applies the invalid class when isInvalid is true', () => {
    render(<TextArea isInvalid />);
    const textarea = screen.getByRole('textbox');
    if (!textarea) {
      throw new Error('Textarea not found');
    }
    if (!textarea.classList.contains('border-red-500')) {
      throw new Error('Invalid class not applied');
    }
  });

  it('triggers onChange when text is entered', () => {
    let value = '';
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      value = e.target.value;
    };

    render(<TextArea onChange={handleChange} />);
    const textarea = screen.getByRole('textbox');
    if (!textarea) {
      throw new Error('Textarea not found');
    }

    fireEvent.change(textarea, { target: { value: 'New text' } });
    if (value !== 'New text') {
      throw new Error('onChange handler not triggered');
    }
  });

  it('renders with the correct number of rows', () => {
    render(<TextArea rows={6} />);
    const textarea = screen.getByRole('textbox');
    if (!textarea) {
      throw new Error('Textarea not found');
    }
    if (textarea.getAttribute('rows') !== '6') {
      throw new Error('Textarea does not have the correct number of rows');
    }
  });
});
