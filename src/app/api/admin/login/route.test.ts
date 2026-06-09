import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { deriveAdminToken } from '@/libs/adminAuth';

import { POST } from './route';

const buildRequest = (body: unknown) =>
  new Request('http://localhost/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

describe('POST /api/admin/login', () => {
  const originalUser = process.env.ADMIN_USER;
  const originalPassword = process.env.ADMIN_PASSWORD;

  beforeEach(() => {
    process.env.ADMIN_USER = 'admin';
    process.env.ADMIN_PASSWORD = 'hunter2';
  });

  afterEach(() => {
    process.env.ADMIN_USER = originalUser;
    process.env.ADMIN_PASSWORD = originalPassword;
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

  it('returns 200 + sets cookie + defaults next to /admin/subscribers', async () => {
    const res = await POST(buildRequest({ user: 'admin', password: 'hunter2' }));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true, next: '/admin/subscribers' });
    const setCookie = res.headers.get('set-cookie') ?? '';
    expect(setCookie).toContain('agility_admin=');
    expect(setCookie).toContain('HttpOnly');
    expect(setCookie).toContain('SameSite=lax');
    const expected = await deriveAdminToken('hunter2');
    expect(setCookie).toContain(`agility_admin=${expected}`);
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
