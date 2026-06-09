import { describe, expect, it } from 'vitest';

import { POST } from './route';

describe('POST /api/admin/logout', () => {
  it('returns 200 and expires the admin cookie', async () => {
    const res = await POST();
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    const setCookie = res.headers.get('set-cookie') ?? '';
    expect(setCookie).toContain('agility_admin=');
    expect(setCookie).toContain('Max-Age=0');
    expect(setCookie).toContain('HttpOnly');
  });
});
