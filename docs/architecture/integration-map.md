# Integration Map

**Generated**: 2026-06-11
**Last updated**: 2026-06-21
**Track**: Brownfield

## External Services

| Service | Integration Point | Protocol | Auth | Status |
|---------|------------------|----------|------|--------|
| GitHub Pages | `.github/workflows/deploy.yml` | Official Pages Actions (artifact upload + deploy) | `GITHUB_TOKEN` / OIDC (`id-token: write`) | Active |
| Cloudflare | DNS CNAME record | DNS | Cloudflare account | Active |
| Umami analytics | `index.html` (`insights.westfieldnexus.com/script.js`) | Script tag | `data-website-id` | Active |
| Umami session recorder | `index.html` (`insights.westfieldnexus.com/recorder.js`) | Script tag (15% sample, moderate masking) | `data-website-id` | Active |
| cal.com | `App.tsx` footer, `Home.tsx` CTA | Static link (`href`) | None | Active |
| LinkedIn | `App.tsx` footer, `About.tsx` | Static link (`href`) | None | Active |
| Email (mailto) | `App.tsx` footer, `About.tsx` | `mailto:` link | None | Active |

## Build-Time Integrations

| Integration | File | Notes |
|------------|------|-------|
| Vite HMR | `vite.config.ts` | Dev server on `:5173` |
| `@tailwindcss/vite` | `vite.config.ts:3` | CSS processed at build time, no PostCSS config needed |
| `@vitejs/plugin-react` | `vite.config.ts:2` | JSX transform, Fast Refresh |

## Test Infrastructure

| Integration | Config File | Notes |
|------------|-------------|-------|
| Playwright → Vite dev server | `playwright.config.ts:18` | `webServer.command = 'npm run dev'`, auto-starts on port 5173 |
| Playwright → Chromium | `playwright.config.ts:25` | Desktop Chrome only; no mobile/Firefox/Safari yet |

## No Backend — Static Constraints

All data is currently hardcoded in source files. Contact is link-only (mailto / LinkedIn / cal.com) — there is no form and no form backend. Future integrations that would require a backend:
- Dynamic project/blog data → would need a headless CMS (Contentful, Sanity) or GitHub-backed JSON
- A contact form (if ever added) → would need Formspree or similar, since the site is static
- Additional analytics → Umami is already wired up; Cloudflare Web Analytics could be added via the Cloudflare dashboard

## Pending Actions

None outstanding. Deploy (GitHub Pages via Actions), DNS (Cloudflare CNAME), and analytics (Umami) are all live.
