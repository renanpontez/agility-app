import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import LocaleSwitcher from './LocaleSwitcher';

const replaceSpy = vi.fn();

vi.mock('@/libs/i18nNavigation', () => ({
  useRouter: () => ({ replace: replaceSpy }),
  usePathname: () => '/portfolio',
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  redirect: () => null,
  getPathname: () => '/portfolio',
}));

vi.mock('next-intl', () => ({
  useLocale: () => 'pt-BR',
}));

describe('LocaleSwitcher', () => {
  it('renders a button per locale with the active one marked pressed', () => {
    render(<LocaleSwitcher />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    const ptButton = screen.getByRole('button', { name: /português/i });
    const enButton = screen.getByRole('button', { name: /Switch to English/i });
    expect(ptButton).toHaveAttribute('aria-pressed', 'true');
    expect(enButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls router.replace with the same pathname and the chosen locale', () => {
    replaceSpy.mockClear();
    render(<LocaleSwitcher />);
    const enButton = screen.getByRole('button', { name: /Switch to English/i });
    fireEvent.click(enButton);
    expect(replaceSpy).toHaveBeenCalledWith('/portfolio', { locale: 'en' });
  });

  it('does nothing when the active locale is clicked', () => {
    replaceSpy.mockClear();
    render(<LocaleSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: /português/i }));
    expect(replaceSpy).not.toHaveBeenCalled();
  });
});
