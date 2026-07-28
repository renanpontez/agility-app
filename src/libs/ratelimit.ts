import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import type { NextRequest } from 'next/server';

// Edge-safe rate limiting via Upstash Redis (REST transport — no TCP). This file
// is imported by the middleware, so it must stay free of any node-only imports.
//
// Every limiter FAILS OPEN when Upstash isn't configured (local dev, or before
// the env vars are set in Vercel): we never block real traffic just because the
// limiter store is unavailable.

let redis: Redis | null = null;
let redisResolved = false;

const getRedis = (): Redis | null => {
  if (redisResolved) {
    return redis;
  }
  redisResolved = true;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    redis = new Redis({ url, token });
  }
  return redis;
};

type Window = Parameters<typeof Ratelimit.slidingWindow>[1];

const cache = new Map<string, Ratelimit | null>();

// Build (and memoize per isolate) a sliding-window limiter. `analytics: false`
// keeps us well within the Upstash free-tier command budget.
const limiter = (id: string, tokens: number, window: Window, prefix: string): Ratelimit | null => {
  if (cache.has(id)) {
    return cache.get(id) ?? null;
  }
  const r = getRedis();
  const instance = r
    ? new Ratelimit({ redis: r, limiter: Ratelimit.slidingWindow(tokens, window), prefix, analytics: false })
    : null;
  cache.set(id, instance);
  return instance;
};

export const limiters = {
  adminLogin: () => limiter('adminLogin', 5, '10 m', 'rl:adminlogin'), // per-IP brute-force guard
  adminGlobal: () => limiter('adminGlobal', 30, '10 m', 'rl:adminlogin:g'), // global cap across all IPs
  subscribe: () => limiter('subscribe', 5, '1 m', 'rl:subscribe'),
  igCard: () => limiter('igCard', 20, '1 m', 'rl:igcard'),
  apiGlobal: () => limiter('apiGlobal', 120, '1 m', 'rl:apiglobal'), // loose per-IP catch-all
};

// Client IP on Vercel: NextRequest.ip was removed, so read the forwarded headers.
export const clientIp = (req: NextRequest): string =>
  req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  || req.headers.get('x-real-ip')
  || '0.0.0.0';

// Geo/location, populated by Vercel's edge network (ASN is not exposed on Hobby).
export const geo = (req: NextRequest) => ({
  country: req.headers.get('x-vercel-ip-country') ?? undefined,
  city: req.headers.get('x-vercel-ip-city') ?? undefined,
  region: req.headers.get('x-vercel-ip-country-region') ?? undefined,
});
