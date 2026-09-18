import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

// Don't add NODE_ENV into T3 Env, it changes the tree-shaking behavior
export const Env = createEnv({
  server: {
    CLERK_SECRET_KEY: z.string().min(1),
    DATABASE_URL: z.string().optional(),
    LOGTAIL_SOURCE_TOKEN: z.string().optional(),
    ADMIN_USER: z.string().optional(),
    ADMIN_PASSWORD: z.string().optional(),
    // HMAC key that signs admin session cookies. Optional so `next build`'s
    // jiti env import doesn't fail when it's unset locally; the admin routes
    // return 503 until it's configured.
    ADMIN_SESSION_SECRET: z.string().min(32).optional(),
    // Rate limiting (Upstash Redis) + security logging. All optional — the
    // limiter fails open and logging is skipped when unset (e.g. local dev).
    UPSTASH_REDIS_REST_URL: z.string().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
    SECURITY_INGEST_TOKEN: z.string().optional(),
    LOGTAIL_INGEST_URL: z.string().optional(),
    // Weekly security digest cron. CRON_SECRET is injected by Vercel Cron as a
    // Bearer token; the recipient defaults to the blog reply-to address.
    CRON_SECRET: z.string().optional(),
    SECURITY_DIGEST_RECIPIENT: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1),
  },
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']),
  },
  // You need to destructure all the keys manually
  runtimeEnv: {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    LOGTAIL_SOURCE_TOKEN: process.env.LOGTAIL_SOURCE_TOKEN,
    ADMIN_USER: process.env.ADMIN_USER,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    SECURITY_INGEST_TOKEN: process.env.SECURITY_INGEST_TOKEN,
    LOGTAIL_INGEST_URL: process.env.LOGTAIL_INGEST_URL,
    CRON_SECRET: process.env.CRON_SECRET,
    SECURITY_DIGEST_RECIPIENT: process.env.SECURITY_DIGEST_RECIPIENT,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
});
