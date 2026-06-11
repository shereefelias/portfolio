# Architecture Overview

**Generated**: 2026-06-11  
**Track**: Brownfield

## System Boundaries

```
┌─────────────────────────────────────────────────────┐
│                   Browser (SPA)                     │
│                                                     │
│  React 19 + React Router 7 + Vite 8                 │
│  ┌──────────┐  ┌──────────────────────────────┐    │
│  │   Nav    │  │         Page Components       │    │
│  │ (sticky) │  │  Home / Work / Viz /          │    │
│  └──────────┘  │  SystemDesign / Contact       │    │
│                └──────────────────────────────┘    │
│                         │                           │
│           ┌─────────────┴──────────────┐           │
│           │                            │           │
│       D3 (Viz)                 fetch() (Contact)   │
└───────────┼────────────────────────────┼───────────┘
            │                            │
     SVG rendering               ┌───────────────┐
     (in-browser)                │  Formspree    │
                                  │  (external)   │
                                  └───────────────┘
```

## Component Hierarchy

```
App.tsx
└── RouterProvider
    └── Layout
        ├── Nav (sticky)
        ├── <Outlet>
        │   ├── Home          (/)
        │   ├── Work          (/work)
        │   ├── Viz           (/viz) → BarChart (D3)
        │   ├── SystemDesign  (/system-design)
        │   └── Contact       (/contact) → Field (input)
        └── footer
```

## Data Flow

| Route | Data Source | Pattern |
|-------|------------|---------|
| `/` | Hardcoded constants | Static render |
| `/work` | `projects[]` array in `Work.tsx` | Static render |
| `/viz` | `chartData[]` array in `Viz.tsx` | D3 imperative draw in `useEffect` |
| `/system-design` | `diagrams[]` array in `SystemDesign.tsx` | Static render |
| `/contact` | Form state (`useState`) | Controlled form → `fetch` → Formspree |

## Routing

`createBrowserRouter` with a single layout route (`/`) wrapping all child routes. History API routing — GitHub Pages must be configured to serve `index.html` for all paths (handled by `peaceiris/actions-gh-pages` by default with a custom 404 redirect or SPA mode).

## Deployment Pipeline

```
git push main
    │
    ▼
GitHub Actions (ubuntu-latest)
    ├── npm ci
    ├── npm run build      → dist/
    ├── echo CNAME         → dist/CNAME
    └── peaceiris/actions-gh-pages@v3
            │
            ▼
        gh-pages branch
            │
            ▼
        GitHub Pages
            │
            ▼
  portfolio.westfieldnexus.com (Cloudflare CNAME → shereefelias.github.io)
```

## Security Posture

- No secrets in the frontend bundle
- Formspree endpoint is a placeholder (must be replaced before going live)
- No auth, no session management
- Content-Security-Policy not yet configured (future: add via Cloudflare Page Rules)
- XSS surface: contact form input is sent as JSON to Formspree — not rendered back to DOM
