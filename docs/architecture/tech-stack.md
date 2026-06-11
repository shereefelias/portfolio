# Tech Stack

**Generated**: 2026-06-11  
**Track**: Brownfield

## Runtime

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Language | TypeScript | 6.x (strict) | `noUnusedLocals`, `noUnusedParameters` |
| UI Framework | React | 19.2.x | StrictMode, concurrent rendering |
| Build Tool | Vite | 8.x | ESM, fast HMR |
| Routing | React Router DOM | 7.x | `createBrowserRouter`, data APIs |
| Styling | Tailwind CSS | 4.x | `@tailwindcss/vite` plugin, CSS-first config |
| Data Viz | D3 | 7.x | SVG-based, typed via `@types/d3` |
| Node | Node.js | 20.x (CI) | LTS, matches GitHub Actions setup |

## Testing

| Tool | Version | Purpose |
|------|---------|---------|
| Playwright | 1.60.x | E2E browser tests, auto-starts dev server |
| Chromium | latest | Single browser target (desktop) |

## Build & Deploy

| Tool | Purpose |
|------|---------|
| Vite build | Bundles to `dist/` (~354 KB JS, ~8 KB CSS) |
| GitHub Actions | CI on push to `main` |
| `peaceiris/actions-gh-pages@v3` | Deploys `dist/` to `gh-pages` branch |
| GitHub Pages | Static hosting |
| Cloudflare | DNS + SSL proxy (`portfolio.westfieldnexus.com` CNAME) |

## Linting

| Tool | Version | Config |
|------|---------|--------|
| ESLint | 10.x | `eslint.config.js`, `react-hooks` + `react-refresh` plugins |

## Key Design Decisions

- **Static-only**: No server. Contact form uses Formspree (external service).
- **Custom domain**: `base: '/'` in Vite config. CNAME written at CI build time.
- **CSS variables over Tailwind utilities for theming**: All design tokens in `src/index.css` `:root` block. Tailwind used for layout utilities.
- **D3 pattern**: `useRef<SVGSVGElement>(null)` + null guard + full redraw in `useEffect`.
