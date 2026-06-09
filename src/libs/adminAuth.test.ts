import { describe, expect, it } from 'vitest';

import { ADMIN_COOKIE_NAME, constantTimeEquals, deriveAdminToken } from './adminAuth';

describe('adminAuth', () => {
  it('exports a stable cookie name', () => {
    expect(ADMIN_COOKIE_NAME).toBe('agility_admin');
  });

  it('derives a 64-char hex token from the password', async () => {
    const token = await deriveAdminToken('hunter2');
    expect(token).toMatch(/^[0-9a-f]{64}$/);
  });

  it('is deterministic for the same password', async () => {
    const a = await deriveAdminToken('hunter2');
    const b = await deriveAdminToken('hunter2');
    expect(a).toBe(b);
  });

  it('produces different tokens for different passwords', async () => {
    const a = await deriveAdminToken('hunter2');
    const b = await deriveAdminToken('hunter3');
    expect(a).not.toBe(b);
  });

  it('constantTimeEquals returns true for identical strings', () => {
    expect(constantTimeEquals('abc123', 'abc123')).toBe(true);
  });

  it('constantTimeEquals returns false for different strings of equal length', () => {
    expect(constantTimeEquals('abc123', 'abc124')).toBe(false);
  });

  it('constantTimeEquals returns false for strings of different length', () => {
    expect(constantTimeEquals('abc', 'abc1')).toBe(false);
  });
});
