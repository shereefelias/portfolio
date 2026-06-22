# Patterns Catalog

**Generated**: 2026-06-11  
**Track**: Brownfield

## P-01: Page-per-Route Pattern

**Where**: `src/pages/*.tsx`  
**Description**: Each route maps to exactly one file in `src/pages/`. The component is the default export. No sub-routing within a page.  
**Example**: `src/pages/Work.tsx:58` — `export default function Work()`

## P-02: Inline Data Arrays

**Where**: `src/pages/Work.tsx`, `src/pages/Advisory.tsx`, `src/pages/Infographics.tsx`, `src/pages/SystemDesign.tsx`  
**Description**: Page-specific data (projects, clients, chart data, diagrams) lives as typed `const` arrays at the top of the page file. No separate data layer yet.  
**Migration path**: Extract to `src/data/` when data grows or needs to be shared.

## P-03: D3 Imperative SVG Pattern

**Where**: `src/pages/Infographics.tsx` (`BarChart`)  
**Description**: D3 charts use `useRef<SVGSVGElement>(null)` + `useEffect([data])`. The effect clears the SVG, runs full D3 imperative draw, then applies transitions. Null guard at top of effect. A `ResizeObserver` re-runs the draw on container resize.  
**Key**: `x(d.label) ?? 0` — handles `scaleBand` returning `undefined` for unknown domains.

## P-05: Typed Data Model at File Top

**Where**: `src/pages/Work.tsx`, `src/pages/Advisory.tsx`, `src/pages/SystemDesign.tsx`  
**Description**: Each data-heavy page defines its types (`Project`, `Client`, `Diagram`) at the top before the data array. `Record<ProjectStatus, string>` used for the status-color lookup.

## P-06: CSS Variable Theming

**Where**: `src/index.css:3`  
**Description**: All design tokens are CSS custom properties on `:root`. Components reference `var(--accent)`, `var(--bg)`, etc. via inline styles. Tailwind is used for layout utilities only.  
**Variables**: navy content theme (`--bg`, `--surface`, `--surface-hover`, `--border`, `--text`, `--text-h`, `--accent`, `--accent-dim`, `--accent-border`) plus light chrome (`--nav-bg`, `--nav-text`, `--footer-bg`, `--footer-text`).

## P-07: NavLink Active Styling via Function Prop

**Where**: `src/components/Nav.tsx:59`  
**Description**: React Router's `NavLink` `style` prop receives `({ isActive }) => ({...})`. Active state drives `font-weight`, `color`, and `background` directly — no className toggling.

## P-08: Layout Wrapper via Outlet

**Where**: `src/App.tsx:9`  
**Description**: `Layout` component renders `<Nav />` + `<Outlet />` + `<footer>`. All pages automatically get the nav and footer without prop drilling. Added via `createBrowserRouter` parent route.

