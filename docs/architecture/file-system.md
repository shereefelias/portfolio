# File System Map

**Project**: portfolio  
**Generated**: 2026-06-11  
**Track**: Brownfield

## Root Layout

```
portfolio/
├── .claude/
│   └── settings.local.json         ← Claude Code project permissions
├── .github/
│   └── workflows/
│       └── deploy.yml              ← CI: build + deploy via official GitHub Pages Actions
├── docs/                           ← Quorum SDLC artifacts
│   ├── architecture/               ← Foundation docs (this directory)
│   ├── tracker/                    ← Entity status tracking
│   │   ├── bugs/
│   │   ├── tech-debt/
│   │   ├── ideas/
│   │   └── change-cards/
│   └── plan/                       ← Spec documents
│       ├── bugs/
│       ├── tech-debt/
│       ├── ideas/
│       └── change-cards/
├── e2e/
│   └── navigation.spec.ts          ← Playwright E2E test suite
├── src/
│   ├── assets/                     ← Static assets (images, SVGs)
│   ├── components/
│   │   └── Nav.tsx                 ← Persistent sticky navigation bar
│   ├── pages/
│   │   ├── Home.tsx                ← / — Hero, credentials, pillars, cal.com CTA
│   │   ├── Work.tsx                ← /work — Project card grid
│   │   ├── Advisory.tsx            ← /advisory — Advisory client cards
│   │   ├── Infographics.tsx        ← /infographics — D3 data viz + tech stack
│   │   ├── SystemDesign.tsx        ← /system-design — Architecture diagrams
│   │   └── About.tsx               ← /about — Bio, photo, career impact
│   ├── App.tsx                     ← Router configuration + Layout wrapper
│   ├── index.css                   ← Global styles + CSS custom properties
│   └── main.tsx                    ← React 19 entry point
├── CLAUDE.md                       ← Project AI instructions + skill index
├── index.html                      ← Vite HTML entry
├── package.json
├── playwright.config.ts            ← E2E test config (webServer auto-start)
├── tsconfig.json                   ← TypeScript strict config
└── vite.config.ts                  ← Vite + Tailwind + React plugins
```

## Key Conventions

- **Pages** — one file per route, flat in `src/pages/`
- **Components** — shared UI in `src/components/`, currently only `Nav.tsx`
- **No `src/hooks/` or `src/utils/` yet** — add as needed, don't pre-create
- **No backend** — 100% static. Contact is link-only (mailto / LinkedIn / cal.com); no form
- **Tests** — Playwright only (E2E); no unit test framework yet
