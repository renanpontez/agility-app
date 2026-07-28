import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { verifyAdminSession } from '@/libs/adminAuth';

import { POST } from './route';

const TEST_SECRET = 'test-secret-at-least-32-characters-long!';

const buildRequest = (body: unknown) =>
  new Request('http://localhost/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

describe('POST /api/admin/login', () => {
  const originalUser = process.env.ADMIN_USER;
  const originalPassword = process.env.ADMIN_PASSWORD;
  const originalSecret = process.env.ADMIN_SESSION_SECRET;

  beforeEach(() => {
    process.env.ADMIN_USER = 'admin';
    process.env.ADMIN_PASSWORD = 'hunter2';
    process.env.ADMIN_SESSION_SECRET = TEST_SECRET;
  });

  afterEach(() => {
    process.env.ADMIN_USER = originalUser;
    process.env.ADMIN_PASSWORD = originalPassword;
    process.env.ADMIN_SESSION_SECRET = originalSecret;
  });

  it('returns 503 when ADMIN_USER is missing', async () => {
    delete process.env.ADMIN_USER;
    const res = await POST(buildRequest({ user: 'admin', password: 'hunter2' }));
    expect(res.status).toBe(503);
    await expect(res.json()).resolves.toEqual({ error: 'disabled' });
  });

  it('returns 503 when ADMIN_PASSWORD is missing', async () => {
    delete process.env.ADMIN_PASSWORD;
    const res = await POST(buildRequest({ user: 'admin', password: 'hunter2' }));
    expect(res.status).toBe(503);
  });

  it('returns 503 when ADMIN_SESSION_SECRET is missing', async () => {
    delete process.env.ADMIN_SESSION_SECRET;
    const res = await POST(buildRequest({ user: 'admin', password: 'hunter2' }));
    expect(res.status).toBe(503);
  });

  it('returns 400 on invalid JSON body', async () => {
    const res = await POST(buildRequest('not-json'));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: 'invalid_request' });
  });

  it('returns 401 on wrong username', async () => {
    const res = await POST(buildRequest({ user: 'nope', password: 'hunter2' }));
    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ error: 'invalid_credentials' });
  });

  it('returns 401 on wrong password', async () => {
    const res = await POST(buildRequest({ user: 'admin', password: 'wrong' }));
    expect(res.status).toBe(401);
  });

  it('returns 200 + sets a valid session cookie + defaults next to /admin/subscribers', async () => {
    const res = await POST(buildRequest({ user: 'admin', password: 'hunter2' }));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true, next: '/admin/subscribers' });
    const setCookie = res.headers.get('set-cookie') ?? '';
    expect(setCookie).toContain('agility_admin=');
    expect(setCookie).toContain('HttpOnly');
    expect(setCookie).toContain('SameSite=lax');
    // Cookie must be a genuine signed session (not the old static token).
    const token = setCookie.match(/agility_admin=([^;]+)/)?.[1];
    await expect(verifyAdminSession(token, TEST_SECRET)).resolves.toBe(true);
  });

  it('honors a safe `next` inside /admin/*', async () => {
    const res = await POST(
      buildRequest({ user: 'admin', password: 'hunter2', next: '/admin/another' }),
    );
    await expect(res.json()).resolves.toEqual({ ok: true, next: '/admin/another' });
  });

  it('rejects external `next` to prevent open redirects', async () => {
    const res = await POST(
      buildRequest({ user: 'admin', password: 'hunter2', next: 'https://evil.com/' }),
    );
    await expect(res.json()).resolves.toEqual({ ok: true, next: '/admin/subscribers' });
  });

  it('rejects protocol-relative `next` to prevent open redirects', async () => {
    const res = await POST(
      buildRequest({ user: 'admin', password: 'hunter2', next: '//evil.com/' }),
    );
    await expect(res.json()).resolves.toEqual({ ok: true, next: '/admin/subscribers' });
  });

  it('rejects non-admin `next`', async () => {
    const res = await POST(
      buildRequest({ user: 'admin', password: 'hunter2', next: '/blog' }),
    );
    await expect(res.json()).resolves.toEqual({ ok: true, next: '/admin/subscribers' });
  });
});
