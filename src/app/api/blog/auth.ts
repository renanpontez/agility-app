import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';

// Reusable bearer-token check for every blog API route. The token is the
// 32-char MD5 hex stored in BLOG_API_TOKEN. Constant-time comparison.
export const isAuthorized = (req: Request): boolean => {
  const expected = process.env.BLOG_API_TOKEN;
  if (!expected) {
    return false;
  }
  const header = req.headers.get('authorization') ?? '';
  // Anchored single-space separator avoids super-linear backtracking on \s+(.+).
  const match = /^Bearer (\S.*)$/i.exec(header);
  if (!match || !match[1]) {
    return false;
  }
  const provided = match[1].trim();
  const expectedBuf = Buffer.from(expected);
  const providedBuf = Buffer.from(provided);
  if (expectedBuf.length !== providedBuf.length) {
    return false;
  }
  try {
    return crypto.timingSafeEqual(expectedBuf, providedBuf);
  } catch {
    return false;
  }
};
