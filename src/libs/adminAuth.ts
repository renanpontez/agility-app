// Admin session: a stateless, HMAC-signed cookie.
//
// Replaces the previous static token (SHA-256 of the password), which was
// identical for every session and never expired — a single leaked cookie was a
// permanent credential. Each session now carries a random nonce + an expiry and
// is signed with ADMIN_SESSION_SECRET; rotating that secret invalidates every
// outstanding session.
//
// Edge-safe by design: uses only Web Crypto (`crypto.subtle`, `btoa`/`atob`),
// never `node:crypto`, so the middleware can verify sessions on the edge runtime.

export const ADMIN_COOKIE_NAME = 'agility_admin';

// 12h — long enough for a working session, short enough that a stolen cookie
// expires on its own (was 30 days on the old static token).
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12;

const encoder = new TextEncoder();

const bytesToBase64Url = (bytes: Uint8Array): string => {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const base64UrlToBytes = (value: string): Uint8Array<ArrayBuffer> => {
  const padded
    = value.replace(/-/g, '+').replace(/_/g, '/')
      + '='.repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  // Back the view with a concrete ArrayBuffer (not ArrayBufferLike) so it
  // satisfies the BufferSource parameter of crypto.subtle.verify.
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const importHmacKey = (secret: string): Promise<CryptoKey> =>
  crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );

type SessionPayload = { v: 1; exp: number; nonce: string };

const nowSeconds = () => Math.floor(Date.now() / 1000);

/**
 * Mint a signed session token: `base64url(payload).base64url(hmac)`. The payload
 * embeds a version, an absolute expiry, and a random nonce so no two tokens are
 * alike (it's no longer a static fingerprint of the password).
 */
export const createAdminSession = async (
  secret: string,
  ttlSeconds: number = ADMIN_SESSION_TTL_SECONDS,
): Promise<string> => {
  const payload: SessionPayload = {
    v: 1,
    exp: nowSeconds() + ttlSeconds,
    nonce: bytesToBase64Url(crypto.getRandomValues(new Uint8Array(16))),
  };
  const payloadB64 = bytesToBase64Url(encoder.encode(JSON.stringify(payload)));
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadB64));
  return `${payloadB64}.${bytesToBase64Url(new Uint8Array(signature))}`;
};

/**
 * Verify a session token: constant-time HMAC check via `crypto.subtle.verify`,
 * then enforce the embedded expiry. Any malformed/tampered/expired token → false.
 */
export const verifyAdminSession = async (
  token: string | undefined,
  secret: string,
): Promise<boolean> => {
  if (!token) {
    return false;
  }
  const dot = token.indexOf('.');
  if (dot <= 0 || dot === token.length - 1) {
    return false;
  }
  const payloadB64 = token.slice(0, dot);
  const signatureB64 = token.slice(dot + 1);
  try {
    const key = await importHmacKey(secret);
    const signatureValid = await crypto.subtle.verify(
      'HMAC',
      key,
      base64UrlToBytes(signatureB64),
      encoder.encode(payloadB64),
    );
    if (!signatureValid) {
      return false;
    }
    const payload = JSON.parse(
      new TextDecoder().decode(base64UrlToBytes(payloadB64)),
    ) as SessionPayload;
    return payload.v === 1
      && typeof payload.exp === 'number'
      && payload.exp > nowSeconds();
  } catch {
    return false;
  }
};

// Length-equal constant-time string compare. Retained for callers that compare
// fixed-length digests (e.g. the login credential check hashes both sides to a
// constant 64-char hex before comparing).
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
