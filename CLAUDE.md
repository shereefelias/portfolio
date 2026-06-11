# Portfolio — Project Instructions

Personal portfolio site for Shereef Elias hosted at `portfolio.westfieldnexus.com`.
Stack: React 19 + Vite 8, TypeScript (strict), Tailwind CSS v4, D3 v7, React Router v7.
Deployed via GitHub Actions → GitHub Pages. DNS via Cloudflare.

---

## Active Skills for This Project

| Task | Use this skill |
|------|---------------|
| React components, hooks, patterns | `react` |
| TypeScript types, generics, discriminated unions | `typescript-advanced-types` |
| E2E tests (navigation, form, D3 charts) | `playwright` |
| Security audit on contact form or new endpoints | `security-review` |
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
│   ├── Home.tsx
│   ├── Work.tsx
│   ├── Viz.tsx       ← D3 visualizations live here
│   ├── SystemDesign.tsx
│   └── Contact.tsx
e2e/                  ← Playwright specs
.github/workflows/    ← deploy.yml (gh-pages branch)
```

---

## Key Constraints

- **Static only** — no server-side code. Contact form must use Formspree or similar.
- **Custom domain** — `base: '/'` in vite.config.ts; CNAME file written by CI.
- **TypeScript strict** — `noUnusedLocals`, `noUnusedParameters` enabled. Fix, don't ignore.
- **No inline JS styles for hover** — prefer CSS variables already defined in `src/index.css`.
- **D3 pattern** — always type the `svgRef` as `useRef<SVGSVGElement>(null)` and guard with `if (!svgRef.current) return`.

## CSS Variables (defined in src/index.css)

```
--bg            #0f0f0f
--surface       #161616
--border        #262626
--accent        #00d9ff
--accent-dim    rgba(0,217,255,0.08)
--accent-border rgba(0,217,255,0.2)
--text          #a3a3a3
--text-h        #f5f5f5
```

---

## Deployment

- Push to `main` → GitHub Actions builds and deploys to `gh-pages` branch
- GitHub Pages: Settings > Pages > Source = `gh-pages`, root `/`
- Cloudflare DNS: CNAME `portfolio` → `shereefelias.github.io` (proxied)
- Contact form endpoint: replace `PLACEHOLDER_ENDPOINT` in `src/pages/Contact.tsx` with real Formspree URL

---

## Running Locally

```bash
npm run dev          # dev server at http://localhost:5173
npm run build        # production build to dist/
npm run test:e2e     # Playwright E2E (starts dev server automatically)
npm run test:e2e:ui  # Playwright UI mode
```
