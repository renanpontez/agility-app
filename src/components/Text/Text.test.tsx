import { render, screen } from '@testing-library/react';

import Text from './Text';

describe('Text component', () => {
  it('should render the text as a paragraph', () => {
    render(<Text as="p">This is a paragraph</Text>);
    const textElement = screen.getByText(/This is a paragraph/i);
    expect(textElement.tagName).toBe('P');
  });

  it('should render bold text', () => {
    render(<Text as="p" decoration="bold">This is bold text</Text>);
    const textElement = screen.getByText(/This is bold text/i);
    expect(textElement).toHaveClass('font-bold');
  });

  it('should render italic text', () => {
    render(<Text as="p" decoration="italic">This is italic text</Text>);
    const textElement = screen.getByText(/This is italic text/i);
    expect(textElement).toHaveClass('italic');
  });

  it('should render text as a blockquote', () => {
    render(<Text as="blockquote">This is a blockquote</Text>);
    const textElement = screen.getByText(/This is a blockquote/i);
    expect(textElement.tagName).toBe('BLOCKQUOTE');
  });

  it('should combine className with custom styles', () => {
    render(<Text as="p" className="text-red-500">This is a custom styled text</Text>);
    const textElement = screen.getByText(/This is a custom styled text/i);
    expect(textElement).toHaveClass('text-red-500');
  });
});
