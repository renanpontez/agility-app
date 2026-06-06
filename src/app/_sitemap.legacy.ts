// Intentionally empty.
//
// `/sitemap.xml` is served from `src/app/sitemap.xml/route.ts` instead of the
// Next.js `MetadataRoute.Sitemap` convention, so we can inject an XSL
// stylesheet directive (`<?xml-stylesheet?>`) into the response. That makes
// the file render as a styled HTML table when a human opens it in a browser
// while still being identical, well-formed XML to crawlers.
//
// Keeping this file around (without a default export) ensures Next.js does
// not try to auto-route it at the same URL.
export {};
