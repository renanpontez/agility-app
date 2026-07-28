import { describe, expect, it } from 'vitest';

import {
  ADMIN_COOKIE_NAME,
  constantTimeEquals,
  createAdminSession,
  verifyAdminSession,
} from './adminAuth';

const SECRET = 'test-secret-at-least-32-characters-long!';

describe('adminAuth', () => {
  it('exports a stable cookie name', () => {
    expect(ADMIN_COOKIE_NAME).toBe('agility_admin');
  });

  it('createAdminSession round-trips through verifyAdminSession', async () => {
    const token = await createAdminSession(SECRET);
    await expect(verifyAdminSession(token, SECRET)).resolves.toBe(true);
  });

  it('mints a unique token on each call (no longer a static fingerprint)', async () => {
    const a = await createAdminSession(SECRET);
    const b = await createAdminSession(SECRET);
    expect(a).not.toBe(b);
    await expect(verifyAdminSession(a, SECRET)).resolves.toBe(true);
    await expect(verifyAdminSession(b, SECRET)).resolves.toBe(true);
  });

  it('rejects a token signed with a different secret', async () => {
    const token = await createAdminSession(SECRET);
    await expect(verifyAdminSession(token, `${SECRET}-other`)).resolves.toBe(false);
  });

  it('rejects a tampered token', async () => {
    const token = await createAdminSession(SECRET);
    const tampered = `x${token.slice(1)}`;
    await expect(verifyAdminSession(tampered, SECRET)).resolves.toBe(false);
  });

  it('rejects an expired token', async () => {
    const token = await createAdminSession(SECRET, -1);
    await expect(verifyAdminSession(token, SECRET)).resolves.toBe(false);
  });

  it('rejects undefined and malformed tokens', async () => {
    await expect(verifyAdminSession(undefined, SECRET)).resolves.toBe(false);
    await expect(verifyAdminSession('', SECRET)).resolves.toBe(false);
    await expect(verifyAdminSession('no-dot-here', SECRET)).resolves.toBe(false);
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
