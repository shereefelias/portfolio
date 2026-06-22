# Portfolio — Project Instructions

Personal portfolio site for Shereef Elias hosted at `portfolio.westfieldnexus.com`.
Stack: React 19 + Vite 8, TypeScript (strict), Tailwind CSS v4, D3 v7, React Router v7.
Deployed via GitHub Actions (official Pages workflow) → GitHub Pages. DNS via Cloudflare.

---

## Active Skills for This Project

| Task | Use this skill |
|------|---------------|
| React components, hooks, patterns | `react` |
| TypeScript types, generics, discriminated unions | `typescript-advanced-types` |
| E2E tests (navigation, D3 charts) | `playwright` |
| Security audit on new external links or endpoints | `security-review` |
| Architecture decisions (new sections, routing) | `create-architectural-decision-record` |
| D3 visualizations, infographics | `react` + `javascript` |
| Shell scripts, GitHub Actions workflows | `shell-scripting` |
| Full feature lifecycle (spec → build → QA) | `quorum` |
| Code quality / refactoring | `laws-of-software-engineering` + `refactor` |

---

## Project Structure

```
src/
├── components/       ← shared UI (Nav, etc.)
├── pages/            ← one file per route
│   ├── Home.tsx          (/)
│   ├── Work.tsx          (/work)
│   ├── Advisory.tsx      (/advisory)
│   ├── Infographics.tsx  (/infographics) ← D3 visualizations live here
│   ├── SystemDesign.tsx  (/system-design)
│   └── About.tsx         (/about)
e2e/                  ← Playwright specs (navigation.spec.ts)
.github/workflows/    ← deploy.yml (official GitHub Pages Actions)
```

There is no Contact page. Contact is handled in the footer (`App.tsx`) via
mailto, LinkedIn, and a cal.com booking link — no contact form, no form backend.

---

## Key Constraints

- **Static only** — no server-side code. Contact is via mailto / LinkedIn / cal.com links (no form backend).
- **Custom domain** — `base: '/'` in vite.config.ts; CNAME file written by CI.
- **Entry point** — `index.html` loads `/src/main.tsx`. Keep this matching the real file name.
- **TypeScript strict** — `noUnusedLocals`, `noUnusedParameters` enabled. Fix, don't ignore.
- **No inline JS styles for hover** — prefer CSS variables already defined in `src/index.css`.
- **D3 pattern** — always type the `svgRef` as `useRef<SVGSVGElement>(null)` and guard with `if (!svgRef.current) return`.

## CSS Variables (defined in src/index.css)

Navy content theme with a light (white) nav and footer.

```
--bg            #0d1b2a
--surface       #112240
--surface-hover #1a3a5c
--border        #1e3a5f
--text          #94a3b8
--text-h        #e2e8f0
--accent        #00d9ff
--accent-dim    rgba(0,217,255,0.10)
--accent-border rgba(0,217,255,0.25)
--nav-bg        #ffffff
--nav-text      #0d1b2a
--footer-bg     #ffffff
--footer-text   #475569
```

---

## Deployment

- Push to `main` → GitHub Actions (`deploy.yml`) runs `npm ci && npm run build`, writes `dist/CNAME`, then publishes `dist/` via the official Pages Actions (`actions/upload-pages-artifact` → `actions/deploy-pages`)
- GitHub Pages: Settings > Pages > Source = **GitHub Actions** (not a branch)
- Cloudflare DNS: CNAME `portfolio` → `shereefelias.github.io` (proxied)
- Analytics: a self-hosted Umami `script.js` + session `recorder.js` from `insights.westfieldnexus.com` load in `index.html`

---

## Running Locally

```bash
npm run dev          # dev server at http://localhost:5173
npm run build        # production build to dist/
npm run test:e2e     # Playwright E2E (starts dev server automatically)
npm run test:e2e:ui  # Playwright UI mode
```
