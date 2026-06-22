import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

// Navy-theme palette for SVG (D3 can't read CSS variables directly).
const C = {
  accent: '#00d9ff',
  accentSoft: 'rgba(0,217,255,0.16)',
  text: '#94a3b8',
  textH: '#e2e8f0',
  grid: '#1e3a5f',
  track: '#1a3a5c',
  muted: '#475569',
  node: '#112240',
}

const SVGNS = 'http://www.w3.org/2000/svg'
const XLINKNS = 'http://www.w3.org/1999/xlink'
const REDUCE_MOTION =
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

// ByteByteGo-style flow dot: a circle that rides a path via <animateMotion>.
// Built with createElementNS so the SMIL elements land in the SVG namespace.
function flowDot(
  parent: SVGGElement,
  pathId: string,
  opts: { dur?: string; begin?: string; r?: number; color?: string } = {},
) {
  if (REDUCE_MOTION) return
  const { dur = '1.8s', begin = '0s', r = 4, color = C.accent } = opts
  const dot = document.createElementNS(SVGNS, 'circle')
  dot.setAttribute('r', String(r))
  dot.setAttribute('fill', color)
  const motion = document.createElementNS(SVGNS, 'animateMotion')
  motion.setAttribute('dur', dur)
  motion.setAttribute('begin', begin)
  motion.setAttribute('repeatCount', 'indefinite')
  const mpath = document.createElementNS(SVGNS, 'mpath')
  mpath.setAttributeNS(XLINKNS, 'xlink:href', `#${pathId}`)
  mpath.setAttribute('href', `#${pathId}`)
  motion.appendChild(mpath)
  dot.appendChild(motion)
  parent.appendChild(dot)
}

function addArrowMarker(
  sel: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  id: string,
  color: string,
) {
  sel
    .append('defs')
    .append('marker')
    .attr('id', id)
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 8)
    .attr('refY', 5)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M0,0 L10,5 L0,10 z')
    .attr('fill', color)
}

type Draw = (svg: SVGSVGElement, width: number) => void

// Shared responsive D3 mount: redraws on container resize.
function useChart(draw: Draw) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const render = () => {
      if (!svgRef.current) return
      draw(svgRef.current, svgRef.current.clientWidth || 600)
    }
    render()
    const observer = new ResizeObserver(render)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [draw])
  return { containerRef, svgRef }
}

function Chart({ draw, ariaLabel }: { draw: Draw; ariaLabel: string }) {
  const { containerRef, svgRef } = useChart(draw)
  return (
    <div ref={containerRef}>
      <svg ref={svgRef} style={{ width: '100%', display: 'block', overflow: 'visible' }} aria-label={ariaLabel} />
    </div>
  )
}

function VizCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section
      className="viz-card"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '1.75rem',
        marginBottom: '1.75rem',
      }}
    >
      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-h)', margin: '0 0 0.25rem' }}>{title}</h2>
      <p style={{ fontSize: '0.825rem', color: 'var(--text)', margin: '0 0 1.5rem' }}>{subtitle}</p>
      {children}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* 1. Quantified impact — before → after with a flowing dot           */
/* ------------------------------------------------------------------ */

const TIME_UNITS = ['Months', 'Weeks', 'Days', 'Hours']

interface ImpactItem {
  label: string
  from: string
  to: string
}

const impactItems: ImpactItem[] = [
  { label: 'Legacy system analysis', from: 'Days', to: 'Hours' },
  { label: 'Portal release cycle', from: 'Weeks', to: 'Days' },
  { label: 'Delivery timeline', from: 'Months', to: 'Weeks' },
]

const drawImpact: Draw = (svg, width) => {
  const sel = d3.select(svg)
  sel.selectAll('*').remove()
  const margin = { top: 22, right: 64, bottom: 36, left: 168 }
  const w = Math.max(width, 320)
  const innerW = w - margin.left - margin.right
  const rowH = 50
  const innerH = impactItems.length * rowH
  const height = innerH + margin.top + margin.bottom
  sel.attr('width', w).attr('height', height)
  const g = sel.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  const x = d3.scalePoint<string>().domain(TIME_UNITS).range([0, innerW]).padding(0.5)
  const y = d3.scaleBand<string>().domain(impactItems.map((d) => d.label)).range([0, innerH]).padding(0.45)
  const X = (u: string) => x(u) ?? 0

  g.selectAll('.tu').data(TIME_UNITS).enter().append('line')
    .attr('x1', (d) => X(d)).attr('x2', (d) => X(d)).attr('y1', 0).attr('y2', innerH)
    .attr('stroke', C.grid).attr('stroke-dasharray', '3,3')

  g.selectAll('.tul').data(TIME_UNITS).enter().append('text')
    .attr('x', (d) => X(d)).attr('y', innerH + 22).attr('text-anchor', 'middle')
    .attr('fill', C.text).attr('font-size', '11px').text((d) => d)

  g.append('text').attr('x', innerW).attr('y', innerH + 22).attr('dx', 10)
    .attr('fill', C.muted).attr('font-size', '10px').text('faster →')

  const rows = g.selectAll('.row').data(impactItems).enter().append('g')
    .attr('transform', (d) => `translate(0,${(y(d.label) ?? 0) + y.bandwidth() / 2})`)

  rows.each(function (this: SVGGElement, d, i) {
    const row = d3.select(this)
    const id = `impact-edge-${i}`
    row.append('path').attr('id', id).attr('fill', 'none')
      .attr('d', `M${X(d.from)},0 L${X(d.to)},0`)
      .attr('stroke', C.accent).attr('stroke-width', 2.5).attr('stroke-dasharray', '2 5').attr('opacity', 0.7)
    flowDot(this, id, { dur: '1.7s', begin: `${i * 0.3}s`, r: 4 })
  })

  rows.append('circle').attr('cx', (d) => X(d.from)).attr('cy', 0).attr('r', 5)
    .attr('fill', C.track).attr('stroke', C.muted).attr('stroke-width', 2)
  rows.append('circle').attr('cx', (d) => X(d.to)).attr('cy', 0).attr('r', 6).attr('fill', C.accent)

  rows.append('text').attr('x', -14).attr('y', 0).attr('dy', '0.32em').attr('text-anchor', 'end')
    .attr('fill', C.textH).attr('font-size', '12.5px').attr('font-weight', 600).text((d) => d.label)
  rows.append('text').attr('x', (d) => X(d.from)).attr('y', -13).attr('text-anchor', 'middle')
    .attr('fill', C.text).attr('font-size', '10.5px').text((d) => d.from)
  rows.append('text').attr('x', (d) => X(d.to)).attr('y', -13).attr('text-anchor', 'middle')
    .attr('fill', C.accent).attr('font-size', '10.5px').attr('font-weight', 600).text((d) => d.to)
}

/* ------------------------------------------------------------------ */
/* 2. Career trajectory timeline — with a tracer dot                  */
/* ------------------------------------------------------------------ */

interface Tenure {
  company: string
  start: number
  end: number
  fill: string
}

interface Milestone {
  year: number
  label: string
  side: 'above' | 'below'
}

const NOW_YEAR = 2026
const tenures: Tenure[] = [
  { company: 'Citigroup', start: 2006, end: 2014, fill: C.track },
  { company: 'Fitch Ratings', start: 2014, end: NOW_YEAR, fill: C.accentSoft },
]
const milestones: Milestone[] = [
  { year: 2006, label: 'Engineer', side: 'below' },
  { year: 2014, label: 'VP · 5 promotions', side: 'above' },
  { year: 2014, label: 'Lead Developer', side: 'below' },
  { year: 2017, label: 'Associate Director', side: 'above' },
  { year: 2021, label: 'Director', side: 'below' },
  { year: NOW_YEAR, label: 'Present', side: 'above' },
]

const drawCareer: Draw = (svg, width) => {
  const sel = d3.select(svg)
  sel.selectAll('*').remove()
  const margin = { top: 48, right: 28, bottom: 30, left: 28 }
  const w = Math.max(width, 320)
  const innerW = w - margin.left - margin.right
  const innerH = 120
  const height = innerH + margin.top + margin.bottom
  sel.attr('width', w).attr('height', height)
  const g = sel.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  const x = d3.scaleLinear().domain([2006, NOW_YEAR]).range([0, innerW])
  const midY = innerH / 2

  g.selectAll('.band').data(tenures).enter().append('rect')
    .attr('x', (d) => x(d.start)).attr('y', midY - 11)
    .attr('width', (d) => x(d.end) - x(d.start)).attr('height', 22).attr('rx', 6)
    .attr('fill', (d) => d.fill).attr('stroke', C.grid)

  g.selectAll('.bandlabel').data(tenures).enter().append('text')
    .attr('x', (d) => (x(d.start) + x(d.end)) / 2).attr('y', midY).attr('dy', '0.32em')
    .attr('text-anchor', 'middle').attr('fill', C.textH).attr('font-size', '11px').attr('font-weight', 600)
    .text((d) => d.company)

  // invisible track for the tracer dot (left → right = progression through time)
  g.append('path').attr('id', 'career-track').attr('fill', 'none').attr('stroke', 'none')
    .attr('d', `M0,${midY} L${innerW},${midY}`)
  flowDot(g.node() as SVGGElement, 'career-track', { dur: '3.4s', r: 4.5 })

  const ticks = [2006, 2010, 2014, 2018, 2022, NOW_YEAR]
  g.selectAll('.tick').data(ticks).enter().append('text')
    .attr('x', (d) => x(d)).attr('y', innerH + 6).attr('text-anchor', 'middle')
    .attr('fill', C.muted).attr('font-size', '10px').text((d) => String(d))

  const m = g.selectAll('.ms').data(milestones).enter().append('g')
    .attr('transform', (d) => `translate(${x(d.year)},${midY})`)
  m.append('circle').attr('r', 0).attr('fill', C.accent).attr('stroke', 'var(--surface)').attr('stroke-width', 2)
    .transition().duration(500).delay((_, i) => i * 90).attr('r', 4.5)
  m.append('line').attr('x1', 0).attr('x2', 0)
    .attr('y1', (d) => (d.side === 'above' ? -11 : 11)).attr('y2', (d) => (d.side === 'above' ? -22 : 22))
    .attr('stroke', C.muted)
  m.append('text').attr('x', 0).attr('y', (d) => (d.side === 'above' ? -27 : 33))
    .attr('text-anchor', 'middle').attr('fill', C.textH).attr('font-size', '11px').attr('font-weight', 600)
    .text((d) => d.label)
}

/* ------------------------------------------------------------------ */
/* 3. Tech radar — Adopt / Trial / Assess                             */
/* ------------------------------------------------------------------ */

const RADAR_QUADRANTS = ['Platforms & Cloud', 'Data & Streaming', 'Languages & APIs', 'AI & DevOps']
const RADAR_RINGS = ['Adopt', 'Trial', 'Assess']

interface Blip {
  q: number
  ring: number
  name: string
}

const radarBlips: Blip[] = [
  { q: 0, ring: 0, name: 'AWS EKS' },
  { q: 0, ring: 0, name: 'Kubernetes' },
  { q: 0, ring: 0, name: 'AWS Lambda' },
  { q: 0, ring: 1, name: 'Aurora RDS' },
  { q: 0, ring: 2, name: 'Azure' },
  { q: 1, ring: 0, name: 'Kafka / MSK' },
  { q: 1, ring: 0, name: 'Snowflake' },
  { q: 1, ring: 1, name: 'Trino / Starburst' },
  { q: 1, ring: 1, name: 'Neo4j' },
  { q: 1, ring: 2, name: 'DynamoDB' },
  { q: 2, ring: 0, name: 'Python' },
  { q: 2, ring: 0, name: 'Java' },
  { q: 2, ring: 1, name: 'FastAPI' },
  { q: 2, ring: 1, name: 'GraphQL' },
  { q: 2, ring: 2, name: 'Node.js' },
  { q: 3, ring: 0, name: 'Argo CD / GitOps' },
  { q: 3, ring: 0, name: 'GitHub Actions' },
  { q: 3, ring: 1, name: 'Claude Code' },
  { q: 3, ring: 1, name: 'Datadog / OTel' },
  { q: 3, ring: 2, name: 'Amazon Q / Gemini' },
]

const drawRadar: Draw = (svg, width) => {
  const sel = d3.select(svg)
  sel.selectAll('*').remove()
  const w = Math.max(width, 320)
  const size = Math.min(w, 460)
  sel.attr('width', w).attr('height', size)
  const cx = w / 2
  const cy = size / 2
  const R = size / 2 - 30
  const ringEdges = [0, R * 0.46, R * 0.74, R]
  const g = sel.append('g').attr('transform', `translate(${cx},${cy})`)

  g.selectAll('.ring').data([1, 2, 3]).enter().append('circle')
    .attr('r', (d) => ringEdges[d]).attr('fill', 'none').attr('stroke', C.grid)

  g.append('line').attr('x1', -R).attr('x2', R).attr('y1', 0).attr('y2', 0).attr('stroke', C.grid)
  g.append('line').attr('x1', 0).attr('x2', 0).attr('y1', -R).attr('y2', R).attr('stroke', C.grid)

  g.selectAll('.rl').data(RADAR_RINGS).enter().append('text')
    .attr('x', 4).attr('y', (_, i) => -(ringEdges[i] + ringEdges[i + 1]) / 2).attr('dy', '0.32em')
    .attr('fill', C.muted).attr('font-size', '9px').text((d) => d)

  const corners: [number, number, string][] = [
    [R, -R + 4, 'start'], [R, R, 'start'], [-R, R, 'end'], [-R, -R + 4, 'end'],
  ]
  g.selectAll('.ql').data(RADAR_QUADRANTS).enter().append('text')
    .attr('x', (_, i) => corners[i][0]).attr('y', (_, i) => corners[i][1])
    .attr('text-anchor', (_, i) => corners[i][2]).attr('fill', C.text)
    .attr('font-size', '10.5px').attr('font-weight', 600).text((d) => d)

  const counts: Record<string, number> = {}
  const totals: Record<string, number> = {}
  radarBlips.forEach((b) => { const k = `${b.q}-${b.ring}`; totals[k] = (totals[k] ?? 0) + 1 })

  const positioned = radarBlips.map((b, i) => {
    const k = `${b.q}-${b.ring}`
    counts[k] = (counts[k] ?? 0) + 1
    const m = totals[k]
    const idx = counts[k]
    const qStart = b.q * (Math.PI / 2)
    const angle = qStart + (idx / (m + 1)) * (Math.PI / 2)
    const rMid = (ringEdges[b.ring] + ringEdges[b.ring + 1]) / 2
    const jitter = ((idx % 2) * 2 - 1) * R * 0.05
    const r = rMid + jitter
    return { n: i + 1, x: Math.cos(angle) * r, y: Math.sin(angle) * r }
  })

  const blip = g.selectAll('.blip').data(positioned).enter().append('g')
    .attr('transform', (d) => `translate(${d.x},${d.y})`)
  blip.append('circle').attr('r', 0).attr('fill', C.accent).attr('opacity', 0.9)
    .transition().duration(450).delay((_, i) => i * 25).attr('r', 9)
  blip.append('text').attr('text-anchor', 'middle').attr('dy', '0.32em')
    .attr('fill', '#0d1b2a').attr('font-size', '9px').attr('font-weight', 700).text((d) => d.n)
}

/* ------------------------------------------------------------------ */
/* 4. AI marketplace adoption curve — with a flowing dot              */
/* ------------------------------------------------------------------ */

// Endpoints are real (14 agents, 93 skills, org-wide); the ramp is illustrative.
const adoptionPts: [number, number][] = [
  [2023, 0], [2023.6, 8], [2024.2, 26], [2024.8, 52], [2025.4, 78], [2026, 100],
]
const adoptionPhases: [number, string][] = [
  [2023.1, 'First agents'],
  [2024.3, 'AI-SDLC standard'],
  [2025.6, 'Org-wide'],
]

const drawAdoption: Draw = (svg, width) => {
  const sel = d3.select(svg)
  sel.selectAll('*').remove()
  const margin = { top: 26, right: 30, bottom: 30, left: 18 }
  const w = Math.max(width, 320)
  const innerW = w - margin.left - margin.right
  const innerH = 180
  const height = innerH + margin.top + margin.bottom
  sel.attr('width', w).attr('height', height)
  const g = sel.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  const x = d3.scaleLinear().domain([2023, 2026]).range([0, innerW])
  const y = d3.scaleLinear().domain([0, 100]).range([innerH, 0])

  g.append('line').attr('x1', 0).attr('x2', innerW).attr('y1', innerH).attr('y2', innerH).attr('stroke', C.grid)

  const area = d3.area<[number, number]>().x((d) => x(d[0])).y0(innerH).y1((d) => y(d[1])).curve(d3.curveBasis)
  const line = d3.line<[number, number]>().x((d) => x(d[0])).y((d) => y(d[1])).curve(d3.curveBasis)

  g.append('path').datum(adoptionPts).attr('fill', C.accentSoft).attr('d', area)
  const path = g.append('path').datum(adoptionPts).attr('id', 'adoption-line').attr('fill', 'none')
    .attr('stroke', C.accent).attr('stroke-width', 2.5).attr('d', line)

  const len = (path.node() as SVGPathElement).getTotalLength()
  path.attr('stroke-dasharray', `${len} ${len}`).attr('stroke-dashoffset', len)
    .transition().duration(1100).attr('stroke-dashoffset', 0)
    .on('end', () => flowDot(g.node() as SVGGElement, 'adoption-line', { dur: '2.4s', r: 4.5 }))

  adoptionPhases.forEach(([yr, label]) => {
    g.append('line').attr('x1', x(yr)).attr('x2', x(yr)).attr('y1', innerH).attr('y2', innerH + 6).attr('stroke', C.muted)
    g.append('text').attr('x', x(yr)).attr('y', innerH + 18).attr('text-anchor', 'middle')
      .attr('fill', C.muted).attr('font-size', '10px').text(label)
  })

  ;[2023, 2024, 2025, 2026].forEach((yr) => {
    g.append('text').attr('x', x(yr)).attr('y', -10).attr('text-anchor', 'middle')
      .attr('fill', C.grid).attr('font-size', '9px').text(String(yr))
  })

  const last = adoptionPts[adoptionPts.length - 1]
  g.append('circle').attr('cx', x(last[0])).attr('cy', y(last[1])).attr('r', 5).attr('fill', C.accent)
  g.append('text').attr('x', x(last[0])).attr('y', y(last[1]) - 12).attr('text-anchor', 'end')
    .attr('fill', C.textH).attr('font-size', '12px').attr('font-weight', 700).text('14 agents · 93 skills')
}

/* ------------------------------------------------------------------ */
/* 5. AI-assisted SDLC flow — ByteByteGo-style nodes + moving dots     */
/* ------------------------------------------------------------------ */

const flowNodes: { title: string; sub: string }[] = [
  { title: 'Codebase', sub: 'Legacy + greenfield' },
  { title: '14 AI Agents', sub: 'Marketplace · 93 skills' },
  { title: 'Generate', sub: 'Code · docs · tests' },
  { title: 'Governance Review', sub: 'AI-SDLC guardrails' },
  { title: 'Ship to Production', sub: 'Argo CD · GitOps' },
]

const drawFlow: Draw = (svg, width) => {
  const sel = d3.select(svg)
  sel.selectAll('*').remove()
  const margin = { top: 10, right: 20, bottom: 10, left: 20 }
  const w = Math.max(width, 320)
  const innerW = w - margin.left - margin.right
  const nodeW = Math.min(innerW, 340)
  const nodeH = 52
  const gap = 30
  const n = flowNodes.length
  const height = margin.top + margin.bottom + n * nodeH + (n - 1) * gap
  sel.attr('width', w).attr('height', height)
  addArrowMarker(sel, 'arrow-flow', C.accent)
  const g = sel.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  const cx = innerW / 2
  const xLeft = cx - nodeW / 2
  const yOf = (i: number) => i * (nodeH + gap)

  for (let i = 0; i < n - 1; i++) {
    const id = `flow-edge-${i}`
    g.append('path').attr('id', id).attr('fill', 'none')
      .attr('d', `M${cx},${yOf(i) + nodeH} L${cx},${yOf(i + 1)}`)
      .attr('stroke', C.accent).attr('stroke-width', 2.5).attr('stroke-dasharray', '2 5')
      .attr('marker-end', 'url(#arrow-flow)').attr('opacity', 0.75)
    flowDot(g.node() as SVGGElement, id, { dur: '1.6s', begin: `${i * 0.25}s`, r: 4 })
  }

  flowNodes.forEach((node, i) => {
    const ny = yOf(i)
    const grp = g.append('g')
    grp.append('rect').attr('x', xLeft).attr('y', ny).attr('width', nodeW).attr('height', nodeH).attr('rx', 10)
      .attr('fill', C.node).attr('stroke', C.accent).attr('stroke-width', 1.5)
    grp.append('text').attr('x', cx).attr('y', ny + nodeH / 2 - 4).attr('text-anchor', 'middle')
      .attr('fill', C.textH).attr('font-size', '13px').attr('font-weight', 700).text(node.title)
    grp.append('text').attr('x', cx).attr('y', ny + nodeH / 2 + 13).attr('text-anchor', 'middle')
      .attr('fill', C.text).attr('font-size', '10.5px').text(node.sub)
  })
}

/* ------------------------------------------------------------------ */

const stats: { value: string; label: string }[] = [
  { value: '$1M+/yr', label: 'Vendor & cloud savings' },
  { value: '+30%', label: 'Analyst productivity' },
  { value: '+20%', label: 'Developer productivity' },
  { value: '14', label: 'AI agents shipped' },
  { value: '93', label: 'AI skills published' },
  { value: '20+ yrs', label: 'Engineering leadership' },
]

export default function Infographics() {
  return (
    <main className="page-main">
      <header style={{ marginBottom: '2.5rem' }}>
        <h1
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-h)',
            margin: '0 0 0.5rem',
          }}
        >
          Infographics
        </h1>
        <p style={{ color: 'var(--text)', maxWidth: 560, margin: 0 }}>
          Outcomes, scale, and trajectory — visualized from real work, built with D3.js. Dots flow along the
          connectors to show direction.
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1px',
          background: 'var(--border)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: '1.75rem',
        }}
      >
        {stats.map(({ value, label }) => (
          <div key={label} style={{ background: 'var(--surface)', padding: '1.25rem 1rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.02em' }}>
              {value}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text)', marginTop: '0.25rem' }}>{label}</div>
          </div>
        ))}
      </div>

      <VizCard title="Quantified Impact" subtitle="Before → after on real initiatives — time compresses left to right.">
        <Chart draw={drawImpact} ariaLabel="Before and after time compression for legacy analysis, portal releases, and delivery timelines" />
      </VizCard>

      <VizCard title="AI-Assisted SDLC" subtitle="How work flows through the internal AI toolchain — dots travel along each step.">
        <Chart draw={drawFlow} ariaLabel="Flow diagram: codebase to AI agents to generation to governance review to production" />
      </VizCard>

      <VizCard title="AI Marketplace Adoption" subtitle="Cumulative growth to org-wide adoption (endpoints actual; ramp illustrative).">
        <Chart draw={drawAdoption} ariaLabel="Growth curve of the internal AI marketplace reaching 14 agents and 93 skills" />
      </VizCard>

      <VizCard title="Career Trajectory" subtitle="20 years across Citigroup and Fitch Ratings — Engineer to Director.">
        <Chart draw={drawCareer} ariaLabel="Career timeline from 2006 to present across Citigroup and Fitch Ratings" />
      </VizCard>

      <VizCard title="Technology Radar" subtitle="A stance on the stack — Adopt (proven), Trial (in use), Assess (exploring).">
        <Chart draw={drawRadar} ariaLabel="Technology radar across platforms, data, languages, and AI/DevOps quadrants" />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '1rem 1.5rem',
            marginTop: '1.5rem',
          }}
        >
          {RADAR_QUADRANTS.map((quadrant, qi) => (
            <div key={quadrant}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.4rem' }}>
                {quadrant}
              </div>
              {radarBlips.map((b, i) => ({ ...b, n: i + 1 })).filter((b) => b.q === qi).map((b) => (
                <div key={b.name} style={{ fontSize: '0.78rem', color: 'var(--text)', lineHeight: 1.7 }}>
                  <span style={{ color: 'var(--text-h)', fontWeight: 600 }}>{b.n}.</span> {b.name}{' '}
                  <span style={{ color: 'var(--text)', opacity: 0.6 }}>· {RADAR_RINGS[b.ring]}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </VizCard>

      {/* Tech Stack inventory */}
      <section style={{ marginTop: '4rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-h)', margin: '0 0 0.4rem' }}>
            Tech Stack
          </h2>
          <p style={{ color: 'var(--text)', fontSize: '0.875rem', margin: 0 }}>
            Full technology inventory across the platforms above.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {techStack.map(({ category, items }, i) => (
            <div
              key={category}
              className="tech-row"
              style={{ background: i % 2 === 0 ? 'var(--surface)' : 'transparent' }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.02em' }}>
                {category}
              </span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.6 }}>
                {items}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

const techStack = [
  { category: 'Cloud & Platforms', items: 'AWS (EKS, Lambda, Glue, MSK, Aurora, Redshift), Azure, Kubernetes, serverless, event-driven' },
  { category: 'AI Engineering & Tooling', items: 'Claude Code, GitHub Copilot/CLI, AWS Kiro, Amazon Q, Gemini, Mistral, Qwen, Apple MLX; agent frameworks, AI-SDLC governance' },
  { category: 'Databases — RDBMS', items: 'Oracle, MSSQL, MySQL, PostgreSQL, AWS Aurora RDS' },
  { category: 'Databases — NoSQL', items: 'MongoDB Atlas, Apache Cassandra, Neo4J, AWS DynamoDB' },
  { category: 'Databases — Analytics', items: 'Starburst.io, Trino, AWS Redshift, Snowflake, Athena' },
  { category: 'Programming', items: 'Python 3, Java, Bash, batch scripting, PowerShell, NodeJS' },
  { category: 'Distributed Streaming', items: 'AWS SNS/SQS, AWS MSK, Apache Kafka, Apache Parquet, KsqlDB' },
  { category: 'API Architectures', items: 'REST, OpenAPI, FastAPI, SOAP, GraphQL' },
  { category: 'Data Pipelines', items: 'Talend Data Fabric Enterprise, SSIS, AWS Glue, Apache Spark, Apache Avro, Apache Airflow' },
  { category: 'DevOps & CI/CD', items: 'Bamboo, JFrog Docker, Argo CD, GitOps, GitHub Actions, Kubernetes (K8s)' },
  { category: 'Monitoring & Observability', items: 'Datadog APM, OpenTelemetry (OTel), Sumo Logic, AWS CloudWatch' },
  { category: 'Automated Code Transform', items: 'LibCST, ast-grep' },
  { category: 'Low-Code Platforms', items: 'Decisions.com (workflow automation, business rules), Talend Data Fabric (enterprise data integration)' },
]
