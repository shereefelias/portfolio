// Single source of truth for per-route SEO metadata.
//
// Consumed in two places:
//   1. src/App.tsx  — <RouteMeta> updates document.title + meta description on
//      client-side navigation.
//   2. vite.config.ts — the seoPrerender build plugin writes a static
//      dist/<route>/index.html for each entry (so GitHub Pages returns 200 with
//      the correct <title>/description/canonical/OG tags) and regenerates
//      sitemap.xml. Keep this file dependency-free so the Vite config can import it.

export const SITE_URL = 'https://portfolio.westfieldnexus.com'

export interface RouteMetaEntry {
  /** <title> — aim for <= 60 chars. */
  title: string
  /** meta description — aim for ~150-160 chars, unique per route. */
  description: string
  /** sitemap.xml priority (0.0-1.0). */
  priority: number
}

// Keys are router paths. Order is preserved in the generated sitemap.
export const routeMeta: Record<string, RouteMetaEntry> = {
  '/': {
    title: 'Shereef Elias — Director of Engineering',
    description:
      'Shereef Elias — Director of Engineering in financial services. 20+ years building and scaling global engineering organizations at Fitch Ratings and Citigroup.',
    priority: 1.0,
  },
  '/work': {
    title: 'Work — Shereef Elias',
    description:
      'Selected engineering work by Shereef Elias — an internal AI agent marketplace, a federated micro-frontend portal, enterprise workflow automation, and CMBS & climate-risk platforms.',
    priority: 0.9,
  },
  '/advisory': {
    title: 'Advisory — Shereef Elias',
    description:
      'Founding technical advisor work by Shereef Elias — guiding early-stage companies on cloud architecture, IT infrastructure, SEO, operations, and hiring from day one.',
    priority: 0.9,
  },
  '/system-design': {
    title: 'System Design — Shereef Elias',
    description:
      'System design by Shereef Elias — federated micro-frontends, event-driven ratings workflows, hybrid-cloud EKS platforms, and AML entity-resolution analytics.',
    priority: 0.8,
  },
  '/infographics': {
    title: 'Infographics & Data Viz — Shereef Elias',
    description:
      'Data visualization and infographic work by Shereef Elias, built with D3.js — interactive charts and a full engineering tech-stack inventory.',
    priority: 0.7,
  },
  '/about': {
    title: 'About Shereef Elias — Engineering Leader',
    description:
      'About Shereef Elias — Director of Engineering at Fitch Ratings, ex-VP at Citigroup. 20+ years leading global engineering organizations in financial services.',
    priority: 0.8,
  },
}

export const DEFAULT_META = routeMeta['/']

// Legacy paths that should redirect to their new home. GitHub Pages can't do
// server-side redirects, so the build emits a static stub at dist/<from>/index.html
// that canonicalizes to and client-redirects to the new path.
export const redirects: Record<string, string> = {
  '/viz': '/infographics',
}

