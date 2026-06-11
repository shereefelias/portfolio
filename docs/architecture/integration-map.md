# Integration Map

**Generated**: 2026-06-11  
**Track**: Brownfield

## External Services

| Service | Integration Point | Protocol | Auth | Status |
|---------|------------------|----------|------|--------|
| Formspree | `src/pages/Contact.tsx:18` | HTTPS POST (JSON) | None (public endpoint) | **Placeholder** — must replace `PLACEHOLDER_ENDPOINT` |
| GitHub Pages | `.github/workflows/deploy.yml` | Git push to `gh-pages` branch | `GITHUB_TOKEN` (Actions secret) | Active |
| Cloudflare | DNS CNAME record | DNS | Cloudflare account | Pending setup |
| LinkedIn | `src/pages/Home.tsx:62` | Static link (`href`) | None | Active |

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

All data is currently hardcoded in source files. Future integrations that would require a backend:
- Dynamic project/blog data → would need a headless CMS (Contentful, Sanity) or GitHub-backed JSON
- Contact form responses → currently Formspree handles storage; a custom backend would enable email notifications
- Analytics → can add Cloudflare Web Analytics (privacy-first, no JS) via Cloudflare dashboard

## Pending Actions

1. **Replace Formspree placeholder** — `src/pages/Contact.tsx:3`: sign up at formspree.io, create form, replace `https://formspree.io/f/placeholder`
2. **Set up Cloudflare CNAME** — Add `CNAME portfolio → shereefelias.github.io` in Cloudflare DNS
3. **Enable GitHub Pages** — Repo Settings > Pages > Source: `gh-pages` branch, root `/`
