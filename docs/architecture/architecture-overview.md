# Architecture Overview

**Generated**: 2026-06-11
**Last updated**: 2026-06-21
**Track**: Brownfield

## System Boundaries

```
┌─────────────────────────────────────────────────────┐
│                   Browser (SPA)                      │
│                                                      │
│  React 19 + React Router 7 + Vite 8                  │
│  ┌──────────┐  ┌──────────────────────────────┐     │
│  │   Nav    │  │        Page Components        │     │
│  │ (sticky) │  │  Home / Work / Advisory /     │     │
│  └──────────┘  │  Infographics /               │     │
│                │  System Design / About        │     │
│                └──────────────────────────────┘     │
│                         │                            │
│                     D3 (Viz)                         │
│                         │                            │
└─────────────────────────┼────────────────────────────┘
                          │
                   SVG rendering
                   (in-browser)

No backend. No form submission. Contact is handled by external links
(mailto, LinkedIn, cal.com) rendered in the footer. Analytics +
session-replay scripts load from insights.westfieldnexus.com (Umami).
```

## Component Hierarchy

```
App.tsx
└── RouterProvider
    └── Layout (Nav + <Outlet> + footer with mailto/LinkedIn/cal.com links)
        ├── Nav (sticky)
        ├── <Outlet>
        │   ├── Home          (/)
        │   ├── Work          (/work)
        │   ├── Advisory      (/advisory)
        │   ├── Infographics  (/infographics) → BarChart (D3)
        │   ├── SystemDesign  (/system-design)
        │   └── About         (/about)
        └── footer
```

## Data Flow

| Route | Data Source | Pattern |
|-------|------------|---------|
| `/` | Hardcoded constants | Static render |
| `/work` | `projects[]` array in `Work.tsx` | Static render |
| `/advisory` | `clients[]` array in `Advisory.tsx` | Static render |
| `/infographics` | `chartData[]` / `techStack[]` arrays in `Infographics.tsx` | D3 imperative draw in `useEffect` (ResizeObserver-driven) |
| `/system-design` | `diagrams[]` array in `SystemDesign.tsx` | Static render |
| `/about` | Hardcoded constants in `About.tsx` | Static render |

## Routing

`createBrowserRouter` with a single layout route (`/`) wrapping all child routes. History API routing — GitHub Pages must serve `index.html` for all paths. (Deep links to non-`/` routes rely on SPA fallback; if direct navigation 404s, add a `404.html` redirect or `public/404.html` copy of `index.html`.)

## Deployment Pipeline

```
git push main
    │
    ▼
GitHub Actions (ubuntu-latest) — .github/workflows/deploy.yml
    build job:
    ├── actions/checkout@v4
    ├── actions/setup-node@v4 (node 20, npm cache)
    ├── npm ci
    ├── npm run build                 → dist/
    ├── echo CNAME                    → dist/CNAME
    └── actions/upload-pages-artifact@v3 (dist/)
    deploy job:
    └── actions/deploy-pages@v4
            │
            ▼
        GitHub Pages (Source = "GitHub Actions")
            │
            ▼
  portfolio.westfieldnexus.com (Cloudflare CNAME → shereefelias.github.io)
```

## Security Posture

- No secrets in the frontend bundle
- No backend, no form submission, no auth, no session management
- Third-party scripts: Umami analytics + session recorder from `insights.westfieldnexus.com` (self-hosted)
- Content-Security-Policy not yet configured (future: add via Cloudflare)
- Minimal XSS surface: all content is hardcoded; no user input is rendered to the DOM
