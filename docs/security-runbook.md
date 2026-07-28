# Security runbook

How the site defends against the bot/scanner traffic we see, how to read the
weekly digest, and what to do when something looks off. Written for a small
site on **Vercel Hobby** — no WAF managed rules or log drains, so protection is
app-level plus a few manual Firewall rules.

## What's in place

| Layer | Where | Notes |
|-------|-------|-------|
| Admin brute-force protection | `src/middleware.ts` + `src/libs/adminAuth.ts` | Signed 12h session; login rate-limited 5/10min per IP + 30/10min global. |
| Rate limiting | `src/libs/ratelimit.ts` (Upstash) | `/api/*` + `/admin/*` only. Fails **open** if Upstash env is missing. |
| Probe blocking | `src/middleware.ts` `PROBE_PATHS` | Extensionless scanner paths → fast 404 + logged. |
| Request logging | `src/libs/securityLog.ts` → BetterStack + `security_events` table | Only "interesting" events (probe / auth_fail / rate_limited); normal traffic is not logged. |
| Endpoint hardening | subscribe honeypot, ig-card `bg` allowlist | See `src/app/api/blog/subscribe`, `src/app/api/ig-card`. |
| Security headers + CSP | `next.config.mjs` | CSP is **Report-Only** until reports are clean (see below). |
| Weekly digest | `src/app/api/cron/security-digest` | Emails a summary + Sentry record every Monday. |

## Required env (Vercel → Settings → Environment Variables)

`ADMIN_SESSION_SECRET` (≥32 bytes; `openssl rand -base64 32`), `UPSTASH_REDIS_REST_URL`,
`UPSTASH_REDIS_REST_TOKEN`, `SECURITY_INGEST_TOKEN`, `LOGTAIL_SOURCE_TOKEN`,
`LOGTAIL_INGEST_URL`, `CRON_SECRET`, `SECURITY_DIGEST_RECIPIENT` (optional; defaults
to `hi@agilitycreative.com`). Without Upstash, rate limiting silently no-ops.

## Where to look

- **Weekly email digest** — top IPs, countries, probed paths, auth-fail timeline.
- **BetterStack** — live, searchable tail of security events.
- **Sentry** — the weekly digest record + CSP violation reports.
- **`security_events` table** — `npm run db:studio` for ad-hoc queries.

## Reading the digest → actions

- **Sustained probes from a few IPs** → Vercel Firewall → add a custom **Deny**
  rule by IP or CIDR.
- **Attack traffic concentrated in a country we don't serve** → Firewall **geo
  Deny**. ⚠️ We serve **pt-BR + en** — don't block Brazil or major en-speaking
  regions.
- **Auth-failure spike on `/api/admin/login`** → tighten the `adminLogin` limiter
  in `src/libs/ratelimit.ts` (e.g. 3/15min), geo-fence `/admin` to BR + your IP
  via a Firewall rule, and rotate `ADMIN_PASSWORD` + `ADMIN_SESSION_SECRET`
  (the latter logs everyone out).
- **Broad volumetric attack** → enable **Attack Challenge Mode** (Firewall) as a
  break-glass. ⚠️ It challenges *all* visitors and breaks the blog publisher /
  API clients — turn it off once the wave passes.
- **High rate-limit triggers on `subscribe`** → enable Cloudflare Turnstile
  (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`) — wiring is stubbed
  for this.

## Manual Vercel Firewall setup (Hobby)

Custom deny rules and Attack Challenge Mode are available on Hobby; rate-limit
*rules*, managed rulesets, and log drains are not (hence the app-level layer).

1. **Deny extension-ending scanner paths** the middleware can't see (the matcher
   skips paths ending in a file extension): path contains `.php`, `.env`,
   `.git`, or starts with `/wp-` → **Deny (403)**.
2. Keep **Attack Challenge Mode** documented as break-glass only.
3. Add IP/CIDR/geo denies reactively, driven by the weekly digest.

## Enforcing the CSP (currently Report-Only)

1. Deploy, then watch `/api/csp-report` → Sentry (`csp-violation`) for a few days.
2. Exercise Clerk sign-in, a three.js page, and a tsparticles page.
3. Add any missing origins (notably the Clerk **production** domain, and
   `'unsafe-eval'` only if flagged) to the policy in `next.config.mjs`.
4. Rename the header `Content-Security-Policy-Report-Only` → `Content-Security-Policy`.

## Incident quick actions

- **Untrusted admin access suspected** → rotate `ADMIN_PASSWORD` +
  `ADMIN_SESSION_SECRET`, redeploy (invalidates all sessions).
- **Leaked API token** → rotate `BLOG_API_TOKEN` in Vercel **and**
  `bot/.secret-token`; rotate `CLERK_SECRET_KEY` in the Clerk dashboard.
- **Under active attack** → Attack Challenge Mode on; deny the top offender
  IPs/CIDRs from the digest; disable once it subsides.
