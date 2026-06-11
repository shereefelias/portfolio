# Patterns Catalog

**Generated**: 2026-06-11  
**Track**: Brownfield

## P-01: Page-per-Route Pattern

**Where**: `src/pages/*.tsx`  
**Description**: Each route maps to exactly one file in `src/pages/`. The component is the default export. No sub-routing within a page.  
**Example**: `src/pages/Work.tsx:58` — `export default function Work()`

## P-02: Inline Data Arrays

**Where**: `src/pages/Work.tsx:1`, `src/pages/Viz.tsx:4`, `src/pages/SystemDesign.tsx:1`  
**Description**: Page-specific data (projects, chart data, diagrams) lives as typed `const` arrays at the top of the page file. No separate data layer yet.  
**Migration path**: Extract to `src/data/` when data grows or needs to be shared.

## P-03: D3 Imperative SVG Pattern

**Where**: `src/pages/Viz.tsx:70`  
**Description**: D3 charts use `useRef<SVGSVGElement>(null)` + `useEffect([data])`. The effect clears the SVG, runs full D3 imperative draw, then applies transitions. Null guard at top of effect.  
**Key**: `x(d.label) ?? 0` — handles `scaleBand` returning `undefined` for unknown domains.

## P-04: Controlled Form + Status Union Type

**Where**: `src/pages/Contact.tsx:14`  
**Description**: Contact form uses a discriminated `FormStatus = 'idle' | 'submitting' | 'success' | 'error'` type. State drives all conditional UI (button disabled, success message, error message).  
**Pattern**: All `onChange` handlers are unified via `[e.target.name]: e.target.value` dynamic key.

## P-05: Typed Data Model at File Top

**Where**: `src/pages/Work.tsx:1`, `src/pages/SystemDesign.tsx:1`  
**Description**: Each data-heavy page defines its types (`Project`, `Diagram`) at the top before the data array. `Record<ProjectStatus, string>` used for the status-color lookup.

## P-06: CSS Variable Theming

**Where**: `src/index.css:3`  
**Description**: All design tokens are CSS custom properties on `:root`. Components reference `var(--accent)`, `var(--bg)`, etc. via inline styles. Tailwind is used for layout utilities only.  
**Variables**: `--bg`, `--surface`, `--border`, `--accent`, `--accent-dim`, `--accent-border`, `--text`, `--text-h`.

## P-07: NavLink Active Styling via Function Prop

**Where**: `src/components/Nav.tsx:59`  
**Description**: React Router's `NavLink` `style` prop receives `({ isActive }) => ({...})`. Active state drives `font-weight`, `color`, and `background` directly — no className toggling.

## P-08: Layout Wrapper via Outlet

**Where**: `src/App.tsx:9`  
**Description**: `Layout` component renders `<Nav />` + `<Outlet />` + `<footer>`. All pages automatically get the nav and footer without prop drilling. Added via `createBrowserRouter` parent route.

## P-09: Interface Prop Typing (extends HTML attrs)

**Where**: `src/pages/Contact.tsx:157`  
**Description**: The `Field` component's props interface `extends React.InputHTMLAttributes<HTMLInputElement>`, so all native input attributes are available without re-declaring them. Label and id are explicitly added on top.
