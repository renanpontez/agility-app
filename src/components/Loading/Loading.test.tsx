import { render, screen } from '@testing-library/react';

import { SimpleLoading } from './';

describe('Loading component', () => {
  it('should render with small size', () => {
    render(<SimpleLoading size="small" />);
    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toHaveClass('w-4 h-4');
  });

  it('should render with medium size', () => {
    render(<SimpleLoading size="medium" />);
    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toHaveClass('w-8 h-8');
  });

  it('should render with big size', () => {
    render(<SimpleLoading size="big" />);
    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toHaveClass('w-12 h-12');
  });

  it('should render with fullscreen size', () => {
    render(<SimpleLoading size="fullscreen" />);
    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toHaveClass('w-16 h-16');
  });

  it('should apply custom class', () => {
    render(<SimpleLoading size="medium" className="text-error" />);
    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toHaveClass('text-error');
  });

  it('should apply custom icon class', () => {
    render(<SimpleLoading size="medium" className="fill-error" />);
    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toHaveClass('fill-error');
  });
});
