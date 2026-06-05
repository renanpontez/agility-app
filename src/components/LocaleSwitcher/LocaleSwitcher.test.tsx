import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import LocaleSwitcher from './LocaleSwitcher';

// jsdom in this project doesn't ship a functional localStorage — stub one.
const buildStorage = (): Storage => {
  const store: Record<string, string> = {};
  return {
    get length() {
      return Object.keys(store).length;
    },
    clear: () => {
      for (const key of Object.keys(store)) {
        delete store[key];
      }
    },
    getItem: (key: string) => (key in store ? store[key]! : null),
    key: (index: number) => Object.keys(store)[index] ?? null,
    removeItem: (key: string) => {
      delete store[key];
    },
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
  };
};

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

beforeEach(() => {
  replaceSpy.mockClear();
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: buildStorage(),
  });
  // jsdom carries cookies between tests; clear them.
  document.cookie
    .split(';')
    .map(c => c.split('=')[0]?.trim())
    .filter(Boolean)
    .forEach((name) => {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });
});

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
    render(<LocaleSwitcher />);
    const enButton = screen.getByRole('button', { name: /Switch to English/i });
    fireEvent.click(enButton);
    expect(replaceSpy).toHaveBeenCalledWith('/portfolio', { locale: 'en' });
  });

  it('does nothing when the active locale is clicked', () => {
    render(<LocaleSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: /português/i }));
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it('persists the chosen locale to localStorage and the NEXT_LOCALE cookie', () => {
    render(<LocaleSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: /Switch to English/i }));
    expect(window.localStorage.getItem('preferredLocale')).toBe('en');
    expect(document.cookie).toContain('NEXT_LOCALE=en');
  });

  it('does not write to storage when the click is a no-op', () => {
    render(<LocaleSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: /português/i }));
    expect(window.localStorage.getItem('preferredLocale')).toBeNull();
    expect(document.cookie).not.toContain('NEXT_LOCALE=');
  });
});
