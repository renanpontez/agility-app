// Shared helpers for the admin Basic Auth replacement: a cookie-based session
// derived from `ADMIN_PASSWORD`. Same security profile as Basic Auth — anyone
// with the password can mint the cookie, rotating the password invalidates
// every existing cookie — but with a friendlier sign-in form instead of the
// browser's native auth prompt.

export const ADMIN_COOKIE_NAME = 'agility_admin';

const TOKEN_SALT = 'agility-admin-v1';

const toHex = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let out = '';
  for (const byte of bytes) {
    out += byte.toString(16).padStart(2, '0');
  }
  return out;
};

/**
 * Cookie value = SHA-256(salt:password). Anyone holding the password can
 * derive it independently, so the middleware verifies by re-deriving and
 * constant-time-comparing. Rotating `ADMIN_PASSWORD` invalidates every
 * existing cookie at the next request.
 */
export const deriveAdminToken = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const digest = await crypto.subtle.digest(
    'SHA-256',
    encoder.encode(`${TOKEN_SALT}:${password}`),
  );
  return toHex(digest);
};

// Length-equal constant-time compare for token strings.
export const constantTimeEquals = (a: string, b: string): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
};
