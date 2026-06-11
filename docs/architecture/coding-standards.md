# Coding Standards

**Generated**: 2026-06-11  
**Track**: Brownfield  
**Stack**: TypeScript 6 / React 19 / Vite 8

---

## TypeScript

### TS-01: Strict mode — always on
`tsconfig.json` has `"strict": true`, `"noUnusedLocals": true`, `"noUnusedParameters": true`. Never disable.

### TS-02: Explicit types on public interfaces
Always type component props, data arrays, and state. Prefer `interface` for object shapes, `type` for unions.

```ts
// Correct
type FormStatus = 'idle' | 'submitting' | 'success' | 'error'
interface Project { id: number; title: string; tags: string[] }

// Wrong
const [status, setStatus] = useState('idle')  // untyped
```

### TS-03: Type imports for type-only
Use `import type` or `type` keyword in destructuring for type-only imports.

```ts
import { useState, type ChangeEvent } from 'react'
```

### TS-04: No `any`
Never use `any`. Use `unknown` + type narrowing if the shape is truly unknown.

### TS-05: Null guards before DOM refs
```ts
// Correct
if (!svgRef.current) return

// Wrong
const svg = d3.select(svgRef.current!)  // non-null assertion
```

---

## React

### R-01: Functional components only
No class components. Default export = component function.

### R-02: Props inline or via interface
```ts
// Simple: inline
function BarChart({ data }: { data: ChartDatum[] }) { ... }

// Complex (3+ props or reused): interface
interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
}
```

### R-03: `useEffect` deps must be exhaustive
Always include all values referenced inside `useEffect` in the dependency array. ESLint `react-hooks/exhaustive-deps` enforces this.

### R-04: No inline anonymous functions for expensive renders
Memoize with `useCallback` / `useMemo` only when profiling shows a problem. Don't pre-optimize.

### R-05: Event handlers: named functions over inline arrows for readability
```ts
// Preferred (readable, avoids re-render noise)
function handleChange(e: ChangeEvent<HTMLInputElement>) { ... }

// Fine for trivial single-liners
onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
```

---

## D3

### D3-01: Always use typed ref
```ts
const svgRef = useRef<SVGSVGElement>(null)
```

### D3-02: Full redraw on data change
Clear `svg.selectAll('*').remove()` at the top of the `useEffect`. Don't try to diff D3 state.

### D3-03: Handle `scaleBand` undefined
`x(d.label)` can return `undefined` for unknown domain values. Always use `?? 0`:
```ts
.attr('x', (d) => x(d.label) ?? 0)
```

---

## CSS / Styling

### CSS-01: Use CSS variables for all design tokens
Reference `var(--accent)`, `var(--bg)`, etc. Never hardcode colors that duplicate a token.

```ts
// Correct
color: 'var(--accent)'

// Wrong
color: '#00d9ff'  // duplicates --accent
```

### CSS-02: `CSSProperties` type for style objects
```ts
import { type CSSProperties } from 'react'
const inputStyle: CSSProperties = { ... }
```

### CSS-03: Tailwind for layout, CSS variables for theme
Use Tailwind utility classes for spacing/flex/grid. Use CSS variables for color/surface/border.

---

## File Organization

### ORG-01: One component per file
Each file exports exactly one default component. No barrel `index.ts` files yet.

### ORG-02: Page data at file top
Typed data arrays (`projects`, `chartData`, `diagrams`) live at the top of their page file, above the component.

### ORG-03: Sub-components at file bottom
Internal components (`ProjectCard`, `BarChart`, `Field`) live below the page default export in the same file until they're needed elsewhere.

---

## Testing

### TEST-01: Playwright for all E2E
All user-facing flows must have a Playwright spec in `e2e/`. Run with `npm run test:e2e`.

### TEST-02: Use ARIA roles and labels in locators
```ts
// Correct — resilient
page.getByRole('heading', { name: 'Shereef Elias' })
page.getByLabel('Email')

// Wrong — brittle
page.locator('.hero h1')
```

### TEST-03: webServer config handles dev server
`playwright.config.ts` auto-starts `npm run dev`. Tests should not assume the server is running.

---

## Git & CI

### GIT-01: Never commit `dist/`
`dist/` is built by CI. Keep it in `.gitignore`.

### GIT-02: `main` branch deploys automatically
Pushing to `main` triggers the GitHub Actions deploy workflow. Do not push broken builds.

### GIT-03: CNAME is CI-managed
Do not commit a `CNAME` file to the repo root. CI writes it to `dist/CNAME` at build time.
