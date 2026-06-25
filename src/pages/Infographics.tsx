import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

// Brand palette (dark teal + gold) for SVG — D3 can't read CSS variables directly.
const C = {
  accent: '#d4ad5e', // gold — primary marks
  accentSoft: 'rgba(208,169,85,0.20)',
  text: '#b9ac90', // muted sand text on teal
  textH: '#f4f0e7', // cream headings / labels
  grid: 'rgba(244,240,231,0.12)', // faint gridlines on teal
  track: '#0a474a', // teal secondary band
  muted: '#8fa49c', // muted teal-gray
  node: '#063b40', // teal box / node fill
  panel: '#04262b', // darker teal canvas
  skill: '#56b6a8', // teal-green — secondary marks (skills)
}

const SVGNS = 'http://www.w3.org/2000/svg'
const XLINKNS = 'http://www.w3.org/1999/xlink'
const REDUCE_MOTION =
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

// ByteByteGo-style flow dot: a circle that rides a path via <animateMotion>.
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

// Two-line word wrap for an SVG <text> centered on its current x.
function wrapLabel(textEl: SVGTextElement, str: string, maxChars: number) {
  const t = d3.select(textEl)
  const x = t.attr('x')
  const words = str.split(' ')
  let line: string[] = []
  t.text(null)
  let tspan = t.append('tspan').attr('x', x).attr('dy', '0em')
  words.forEach((word) => {
    line.push(word)
    if (line.join(' ').length > maxChars && line.length > 1) {
      line.pop()
      tspan.text(line.join(' '))
      line = [word]
      tspan = t.append('tspan').attr('x', x).attr('dy', '1.15em').text(word)
    } else {
      tspan.text(line.join(' '))
    }
  })
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
        background: 'linear-gradient(160deg, #073b40, #052b31)',
        border: '1px solid var(--accent-border)',
        borderRadius: 12,
        padding: '1.75rem',
        marginBottom: '1.75rem',
      }}
    >
      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f4f0e7', margin: '0 0 0.25rem' }}>{title}</h2>
      <p style={{ fontSize: '0.825rem', color: '#b9ac90', margin: '0 0 1.5rem' }}>{subtitle}</p>
      {children}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* 1. Cost-savings waterfall — where the $1M+/yr comes from            */
/* ------------------------------------------------------------------ */

interface WfStep {
  label: string
  value: number // $M — annual vendor fee at that point; the replaced bar ≈ $0
  kind: 'fee' | 'replaced'
  note?: string
}

// Real story: the vendor fee kept climbing — $0.5M, then $0.75M, then a $1.4M renewal
// quote (hikes went from roughly every two years to annual). I replaced it with an
// ephemeral Airflow-on-EKS pattern (spin up EKS → run the job → terminate, instead of
// 7 always-on 32 GB EC2 instances), collapsing the run-rate to pay-per-run ≈ $0.
const savings: WfStep[] = [
  { label: 'Initial vendor fee', value: 0.5, kind: 'fee', note: 'starting price' },
  { label: 'Renewal', value: 0.75, kind: 'fee', note: '+50% · ~every 2 yrs' },
  { label: 'Latest quote', value: 1.4, kind: 'fee', note: '+87% · now yearly' },
  { label: 'Replaced — ephemeral Airflow-on-EKS', value: 0.05, kind: 'replaced', note: 'pay-per-run ≈ $0' },
]

const fmtFee = (v: number) => (v < 1 ? `$${Math.round(v * 1000)}k` : `$${v.toFixed(2)}M`)

const drawWaterfall: Draw = (svg, width) => {
  const sel = d3.select(svg)
  sel.selectAll('*').remove()
  const margin = { top: 38, right: 16, bottom: 72, left: 50 }
  const w = Math.max(width, 340)
  const innerW = w - margin.left - margin.right
  const innerH = 240
  const height = innerH + margin.top + margin.bottom
  sel.attr('width', w).attr('height', height)
  addArrowMarker(sel, 'wf-arrow', C.accent)
  const g = sel.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  const y = d3.scaleLinear().domain([0, 1.5]).range([innerH, 0])
  const x = d3.scaleBand<string>().domain(savings.map((s) => s.label)).range([0, innerW]).padding(0.4)
  const cx = (s: WfStep) => (x(s.label) ?? 0) + x.bandwidth() / 2

  const yTicks = [0, 0.5, 1.0, 1.5]
  g.selectAll('.gl').data(yTicks).enter().append('line')
    .attr('x1', 0).attr('x2', innerW).attr('y1', (d) => y(d)).attr('y2', (d) => y(d))
    .attr('stroke', C.grid).attr('stroke-dasharray', '3,3')
  g.selectAll('.gll').data(yTicks).enter().append('text')
    .attr('x', -8).attr('y', (d) => y(d)).attr('dy', '0.32em').attr('text-anchor', 'end')
    .attr('fill', C.muted).attr('font-size', '9px').text((d) => `$${d.toFixed(1)}M`)

  // escalating trend line through the three climbing vendor-fee bars
  const fees = savings.filter((s) => s.kind === 'fee')
  const trend = d3.line<WfStep>().x((s) => cx(s)).y((s) => y(s.value))
  g.append('path').datum(fees).attr('d', trend).attr('fill', 'none')
    .attr('stroke', C.accent).attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3').attr('opacity', 0)
    .transition().duration(600).delay(300).attr('opacity', 0.5)

  // columns — fees climb from the baseline; the replaced bar is a near-zero sliver
  const grp = g.selectAll('.bar').data(savings).enter().append('g')
  grp.append('rect')
    .attr('x', (d) => x(d.label) ?? 0).attr('width', x.bandwidth())
    .attr('y', innerH).attr('height', 0).attr('rx', 4)
    .attr('fill', (d) => (d.kind === 'replaced' ? C.accent : C.accentSoft))
    .attr('stroke', C.accent).attr('stroke-width', (d) => (d.kind === 'replaced' ? 0 : 1.2))
    .transition().duration(650).delay((_, i) => i * 150)
    .attr('y', (d) => y(d.value)).attr('height', (d) => Math.max(2, innerH - y(d.value)))

  // value labels above each bar
  grp.append('text')
    .attr('x', (d) => cx(d)).attr('y', (d) => y(d.value) - 9)
    .attr('text-anchor', 'middle').attr('fill', (d) => (d.kind === 'replaced' ? C.accent : C.textH))
    .attr('font-size', '12px').attr('font-weight', 700).attr('opacity', 0)
    .text((d) => (d.kind === 'replaced' ? '≈ $0' : fmtFee(d.value)))
    .transition().duration(400).delay((_, i) => 480 + i * 150).attr('opacity', 1)

  // savings annotation — dashed elbow from the $1.4M quote down to the replaced run-rate
  const quote = savings[2]
  const repl = savings[3]
  const x2 = cx(quote)
  const x3 = cx(repl)
  g.append('path')
    .attr('d', `M ${x2},${y(quote.value)} C ${x2 + 34},${y(quote.value)} ${x3 - 34},${y(repl.value) - 16} ${x3},${y(repl.value) - 14}`)
    .attr('fill', 'none').attr('stroke', C.accent).attr('stroke-width', 1.6)
    .attr('stroke-dasharray', '3,3').attr('marker-end', 'url(#wf-arrow)').attr('opacity', 0)
    .transition().duration(500).delay(1000).attr('opacity', 0.9)
  g.append('text').attr('x', (x2 + x3) / 2).attr('y', y(0.92)).attr('text-anchor', 'middle')
    .attr('fill', C.accent).attr('font-size', '12px').attr('font-weight', 800).attr('opacity', 0)
    .text('−$1.40M/yr')
    .transition().duration(400).delay(1150).attr('opacity', 1)

  // x-axis labels (wrapped) + a small italic note line under each
  grp.append('text')
    .attr('x', (d) => cx(d)).attr('y', innerH + 16)
    .attr('text-anchor', 'middle').attr('fill', C.text).attr('font-size', '9.5px')
    .each(function (this: SVGTextElement, d) {
      wrapLabel(this, d.label, Math.max(12, Math.floor(x.bandwidth() / 5)))
      if (d.note) {
        d3.select(this).append('tspan').attr('x', this.getAttribute('x'))
          .attr('dy', '1.3em').attr('fill', C.muted).attr('font-size', '8.5px')
          .attr('font-style', 'italic').text(d.note)
      }
    })
}

/* ------------------------------------------------------------------ */
/* 2. Follow-the-sun global coverage                                  */
/* ------------------------------------------------------------------ */

interface Hub {
  city: string
  tz: string
  startUTC: number
  endUTC: number
}

// Local 09:00–17:00 mapped to UTC.
const hubs: Hub[] = [
  { city: 'Chennai, India', tz: 'IST · UTC+5:30', startUTC: 3.5, endUTC: 11.5 },
  { city: 'Manchester, UK', tz: 'GMT · UTC+0', startUTC: 9, endUTC: 17 },
  { city: 'London, UK', tz: 'GMT · UTC+0', startUTC: 9, endUTC: 17 },
  { city: 'Toronto, Canada', tz: 'ET · UTC−5', startUTC: 14, endUTC: 22 },
  { city: 'New York, US', tz: 'ET · UTC−5', startUTC: 14, endUTC: 22 },
  { city: 'Chicago, US', tz: 'CT · UTC−6', startUTC: 15, endUTC: 23 },
]

const drawFollowSun: Draw = (svg, width) => {
  const sel = d3.select(svg)
  sel.selectAll('*').remove()
  const margin = { top: 30, right: 30, bottom: 24, left: 120 }
  const w = Math.max(width, 320)
  const innerW = w - margin.left - margin.right
  const rowH = 30
  const innerH = (hubs.length + 1) * rowH
  const height = innerH + margin.top + margin.bottom
  sel.attr('width', w).attr('height', height)
  const g = sel.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  const x = d3.scaleLinear().domain([0, 24]).range([0, innerW])
  const hourTicks = [0, 3, 6, 9, 12, 15, 18, 21, 24]
  g.selectAll('.h').data(hourTicks).enter().append('line')
    .attr('x1', (d) => x(d)).attr('x2', (d) => x(d)).attr('y1', -6).attr('y2', innerH)
    .attr('stroke', C.grid).attr('stroke-dasharray', '2,3')
  g.selectAll('.ht').data(hourTicks).enter().append('text')
    .attr('x', (d) => x(d)).attr('y', -12).attr('text-anchor', 'middle')
    .attr('fill', C.muted).attr('font-size', '9px').text((d) => (d === 24 ? '24' : String(d)))
  g.append('text').attr('x', -margin.left + 2).attr('y', -12).attr('fill', C.muted).attr('font-size', '9px').text('UTC →')

  hubs.forEach((h, i) => {
    const ry = i * rowH
    g.append('text').attr('x', -12).attr('y', ry + rowH / 2 - 3).attr('text-anchor', 'end')
      .attr('fill', C.textH).attr('font-size', '11px').attr('font-weight', 600).text(h.city)
    g.append('text').attr('x', -12).attr('y', ry + rowH / 2 + 9).attr('text-anchor', 'end')
      .attr('fill', C.muted).attr('font-size', '8px').text(h.tz)
    g.append('rect')
      .attr('x', x(h.startUTC)).attr('y', ry + 7).attr('width', 0).attr('height', rowH - 14).attr('rx', 4)
      .attr('fill', C.accentSoft).attr('stroke', C.accent).attr('stroke-width', 1)
      .transition().duration(600).delay(i * 90).attr('width', x(h.endUTC) - x(h.startUTC))
  })

  const cy = hubs.length * rowH
  const covStart = Math.min(...hubs.map((h) => h.startUTC))
  const covEnd = Math.max(...hubs.map((h) => h.endUTC))
  g.append('text').attr('x', -12).attr('y', cy + rowH / 2).attr('dy', '0.32em').attr('text-anchor', 'end')
    .attr('fill', C.accent).attr('font-size', '11px').attr('font-weight', 700).text('Coverage')
  g.append('rect').attr('x', x(covStart)).attr('y', cy + 6).attr('width', x(covEnd) - x(covStart)).attr('height', rowH - 12).attr('rx', 4)
    .attr('fill', 'rgba(208,169,85,0.34)').attr('stroke', C.accent).attr('stroke-width', 1)
  g.append('path').attr('id', 'sun-track').attr('fill', 'none').attr('stroke', 'none')
    .attr('d', `M${x(covStart)},${cy + rowH / 2} L${x(covEnd)},${cy + rowH / 2}`)
  flowDot(g.node() as SVGGElement, 'sun-track', { dur: '4s', r: 5 })
  g.append('text').attr('x', x(covEnd)).attr('y', cy + rowH / 2).attr('dx', 8).attr('dy', '0.32em')
    .attr('fill', C.muted).attr('font-size', '9px').text(`~${Math.round(covEnd - covStart)}h / day`)
}

/* ------------------------------------------------------------------ */
/* 3. AI-assisted SDLC — continuous CI/CD loop                        */
/* ------------------------------------------------------------------ */

const sdlcStages: { stage: string; tag: string }[] = [
  { stage: 'Plan & Spec', tag: 'BA · Architect' },
  { stage: 'Build', tag: 'Dev · Test-gen' },
  { stage: 'Review', tag: 'Security · Quality' },
  { stage: 'Ship', tag: 'GitOps · Argo CD' },
  { stage: 'Operate', tag: 'Observability' },
]

const drawSdlc: Draw = (svg, width) => {
  const sel = d3.select(svg)
  sel.selectAll('*').remove()
  const w = Math.max(width, 360)
  const size = Math.min(w, 520)
  const height = size
  sel.attr('width', w).attr('height', height)
  addArrowMarker(sel, 'arrow-loop', C.accent)
  const cx = w / 2
  const cy = height / 2
  const R = size / 2 - 78
  const n = sdlcStages.length
  const ang = (i: number) => (i / n) * 2 * Math.PI - Math.PI / 2
  const P = (a: number, rad = R): [number, number] => [cx + rad * Math.cos(a), cy + rad * Math.sin(a)]
  const g = sel.append('g')

  // faint guide ring + invisible orbit path for the perpetual flow dot
  g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', R).attr('fill', 'none')
    .attr('stroke', C.grid).attr('stroke-dasharray', '2,5')
  g.append('path').attr('id', 'loop-orbit').attr('fill', 'none').attr('stroke', 'none')
    .attr('d', `M ${cx + R},${cy} A ${R},${R} 0 1 1 ${cx - R},${cy} A ${R},${R} 0 1 1 ${cx + R},${cy}`)

  // directional arcs between stages + a governance gate on each arc
  const gap = 0.28
  for (let i = 0; i < n; i++) {
    const [x1, y1] = P(ang(i) + gap)
    const [x2, y2] = P(ang(i + 1) - gap)
    g.append('path').attr('fill', 'none')
      .attr('d', `M ${x1},${y1} A ${R},${R} 0 0 1 ${x2},${y2}`)
      .attr('stroke', C.accent).attr('stroke-width', 2).attr('stroke-dasharray', '2 5')
      .attr('opacity', 0.7).attr('marker-end', 'url(#arrow-loop)')
    const [gx, gy] = P((ang(i) + ang(i + 1)) / 2)
    g.append('rect').attr('x', gx - 4.5).attr('y', gy - 4.5).attr('width', 9).attr('height', 9)
      .attr('transform', `rotate(45 ${gx} ${gy})`).attr('fill', C.node).attr('stroke', C.accent)
  }

  flowDot(g.node() as SVGGElement, 'loop-orbit', { dur: '6s', r: 4.5 })

  // stage nodes + labels around the ring
  sdlcStages.forEach((s, i) => {
    const a = ang(i)
    const [x, y] = P(a)
    g.append('circle').attr('cx', x).attr('cy', y).attr('r', 0)
      .attr('fill', C.accent).attr('stroke', C.node).attr('stroke-width', 2)
      .transition().duration(450).delay(i * 80).attr('r', 8)
    const c = Math.cos(a)
    const [lx, ly] = P(a, R + 16)
    const anchor = c > 0.3 ? 'start' : c < -0.3 ? 'end' : 'middle'
    const tg = g.append('text').attr('x', lx).attr('y', ly).attr('text-anchor', anchor)
      .attr('fill', C.textH).attr('font-size', '11px').attr('font-weight', 700).attr('opacity', 0)
    tg.append('tspan').attr('x', lx).text(s.stage)
    tg.append('tspan').attr('x', lx).attr('dy', '1.15em').attr('fill', C.text)
      .attr('font-size', '9px').attr('font-weight', 400).text(s.tag)
    tg.transition().duration(400).delay(300 + i * 80).attr('opacity', 1)
  })

  // centre label
  const ct = g.append('text').attr('x', cx).attr('y', cy).attr('text-anchor', 'middle').attr('fill', C.accent)
  ct.append('tspan').attr('x', cx).attr('dy', '-0.15em').attr('font-size', '13px').attr('font-weight', 800).text('Continuous')
  ct.append('tspan').attr('x', cx).attr('dy', '1.2em').attr('font-size', '13px').attr('font-weight', 800).text('Delivery')
}

/* ------------------------------------------------------------------ */
/* AI portfolio — agent ↔ skill network (shows reuse / complexity)    */
/* ------------------------------------------------------------------ */

// Labeled hubs = specialized agents; the cloud = the shared skill library.
const agentHubs = [
  'Quorum SDLC', 'Python', 'Rust', 'Database', 'Frontend', 'Apple',
  'Playwright', 'MCP', 'Security', 'Codemod', 'Excel/Office', 'Skill-builder',
]
// Real skill data from README matrix.
// Agent indices match agentHubs order:
// 0=Quorum SDLC  1=Python  2=Rust   3=Database  4=Frontend  5=Apple
// 6=Playwright   7=MCP     8=Security  9=Codemod  10=Excel/Office  11=Skill-builder
const SKILLS: { name: string; agents: number[] }[] = [
  { name: 'agent-orchestration', agents: [7] },
  { name: 'agentic-eval', agents: [7, 11] },
  { name: 'airflow', agents: [1] },
  { name: 'ast-grep', agents: [9] },
  { name: 'audit-integrity', agents: [3, 1, 2, 5, 8] },
  { name: 'brownfield-analysis', agents: [10, 0, 7, 8] },
  { name: 'claude-api', agents: [7] },
  { name: 'create-architectural-decision-record', agents: [3, 1, 2, 4, 5, 0, 7] },
  { name: 'creating-oracle-to-postgres-plan', agents: [3] },
  { name: 'doc-coauthoring', agents: [0, 7, 8] },
  { name: 'docker', agents: [3, 1, 2, 7] },
  { name: 'excel-compare', agents: [10] },
  { name: 'excel-vba-standards', agents: [10] },
  { name: 'fastapi', agents: [1] },
  { name: 'file-reader', agents: [10] },
  { name: 'gdpr-compliant', agents: [3, 10, 1, 4, 8] },
  { name: 'gherkin-bdd', agents: [3, 10, 1, 9, 0, 7, 8] },
  { name: 'interactive-infographics', agents: [0] },
  { name: 'javascript', agents: [4, 6] },
  { name: 'kafka', agents: [1] },
  { name: 'kubernetes', agents: [1] },
  { name: 'laws-of-software-engineering', agents: [3, 10, 1, 2, 4, 5, 9, 0, 7, 8] },
  { name: 'make-repo-contribution', agents: [0, 7] },
  { name: 'mcp-builder', agents: [7] },
  { name: 'meeting-minutes', agents: [8] },
  { name: 'migrating-oracle-to-postgres-sp', agents: [3] },
  { name: 'nextjs', agents: [4] },
  { name: 'oracle-sql', agents: [3] },
  { name: 'pci-dss-compliant', agents: [8] },
  { name: 'persistent-memory-setup', agents: [7] },
  { name: 'plantuml-ascii', agents: [3, 0] },
  { name: 'playwright', agents: [1, 4, 6] },
  { name: 'polars-duckdb', agents: [1] },
  { name: 'postgresql-sql', agents: [3] },
  { name: 'prd', agents: [0] },
  { name: 'pytest-coverage', agents: [1] },
  { name: 'python', agents: [1, 9, 7] },
  { name: 'quorum', agents: [0] },
  { name: 'react', agents: [4] },
  { name: 'react-native', agents: [4] },
  { name: 'readme-generator', agents: [0, 7, 8] },
  { name: 'redis', agents: [1] },
  { name: 'refactor', agents: [1, 9] },
  { name: 'ruff-recursive-fix', agents: [1, 9] },
  { name: 'rust-async', agents: [2] },
  { name: 'rust-concurrency', agents: [2] },
  { name: 'rust-core', agents: [2] },
  { name: 'rust-idiomatic', agents: [2] },
  { name: 'rust-testing', agents: [2] },
  { name: 'rust-unsafe', agents: [2] },
  { name: 'sast-dependency-scanning', agents: [8] },
  { name: 'security-review', agents: [8] },
  { name: 'seo-content-strategy', agents: [4] },
  { name: 'seo-performance-monitor', agents: [4] },
  { name: 'seo-schema-markup', agents: [4] },
  { name: 'seo-technical-audit', agents: [4] },
  { name: 'shell-scripting', agents: [3, 1, 2, 4, 5, 6] },
  { name: 'soc2-compliant', agents: [8] },
  { name: 'sql-optimization', agents: [3] },
  { name: 'swift-macos', agents: [5] },
  { name: 'swiftui', agents: [5] },
  { name: 'typescript-advanced-types', agents: [10, 4, 6, 7] },
  { name: 'vba-code-review', agents: [10] },
  { name: 'web-design-guidelines', agents: [4] },
  { name: 'skill-creator', agents: [11] },
  { name: 'subagent-designer', agents: [11] },
  { name: 'agent-architect', agents: [11] },
]

interface NetNode extends d3.SimulationNodeDatum {
  id: string
  type: 'agent' | 'skill'
  label?: string
  r: number
  ang?: number
  deg?: number
}
interface NetLink extends d3.SimulationLinkDatum<NetNode> {
  source: string | NetNode
  target: string | NetNode
}

const drawNetwork: Draw = (svg, width) => {
  const sel = d3.select(svg)
  sel.selectAll('*').remove()
  const w = Math.max(width, 320)
  const height = Math.min(Math.max(w * 0.82, 380), 620)
  sel.attr('width', w).attr('height', height)
  const cx = w / 2
  const cy = height / 2
  const R = Math.min(w, height) / 2 - 58 // agent-ring radius (leaves room for labels)

  // Agents fixed evenly around the ring; deg = skill count for tooltip.
  const nA = agentHubs.length
  const agents: NetNode[] = agentHubs.map((nm, i) => {
    const ang = (i / nA) * 2 * Math.PI - Math.PI / 2
    const x = cx + R * Math.cos(ang)
    const y = cy + R * Math.sin(ang)
    const skillCount = SKILLS.filter((s) => s.agents.includes(i)).length
    return { id: `a${i}`, type: 'agent', label: nm, r: 9, ang, x, y, fx: x, fy: y, deg: skillCount }
  })

  // Skills start near the centre; simulation pulls each toward its agents. Size by reuse.
  const skills: NetNode[] = SKILLS.map((s, i) => ({
    id: `s${i}`, type: 'skill', label: s.name,
    r: 3.5 + (s.agents.length - 1) * 0.85,
    deg: s.agents.length,
    x: cx + (i % 7 - 3) * 6, y: cy + ((i % 5) - 2) * 6,
  }))
  const nodes: NetNode[] = [...agents, ...skills]

  // Real connections from README matrix.
  const links: NetLink[] = SKILLS.flatMap((s, i) =>
    s.agents.map((agentIdx) => ({ source: `s${i}`, target: `a${agentIdx}` }))
  )

  const sim = d3
    .forceSimulation<NetNode>(nodes)
    .force('link', d3.forceLink<NetNode, NetLink>(links).id((d) => d.id).distance(R * 0.55).strength(0.22))
    .force('charge', d3.forceManyBody<NetNode>().strength(-16))
    .force('collide', d3.forceCollide<NetNode>().radius((d) => d.r + 2))
    .force('x', d3.forceX<NetNode>(cx).strength(0.03))
    .force('y', d3.forceY<NetNode>(cy).strength(0.03))
    .stop()
  for (let i = 0; i < 500; i++) sim.tick()

  // Keep skills inside the ring.
  skills.forEach((n) => {
    const dx = (n.x ?? cx) - cx
    const dy = (n.y ?? cy) - cy
    const dist = Math.hypot(dx, dy)
    const max = R - 12
    if (dist > max) {
      n.x = cx + (dx / dist) * max
      n.y = cy + (dy / dist) * max
    }
  })

  const xy = (e: string | NetNode) => e as NetNode
  const idOf = (e: string | NetNode) => (typeof e === 'string' ? e : e.id)

  // adjacency for hover highlighting
  const linkIdx = new Map<string, number[]>()
  const neighbors = new Map<string, Set<string>>()
  nodes.forEach((nd) => {
    linkIdx.set(nd.id, [])
    neighbors.set(nd.id, new Set<string>())
  })
  links.forEach((lk, i) => {
    const s = idOf(lk.source)
    const t = idOf(lk.target)
    linkIdx.get(s)?.push(i)
    linkIdx.get(t)?.push(i)
    neighbors.get(s)?.add(t)
    neighbors.get(t)?.add(s)
  })

  // dark teal canvas + gold frame
  sel.append('rect').attr('x', 0).attr('y', 0).attr('width', w).attr('height', height)
    .attr('rx', 12).attr('fill', C.panel).attr('stroke', 'rgba(208,169,85,0.30)')

  // clip so zoomed / panned nodes stay inside the frame
  const clipId = 'net-clip'
  sel.append('clipPath').attr('id', clipId).append('rect')
    .attr('x', 1).attr('y', 1).attr('width', w - 2).attr('height', height - 2).attr('rx', 12)

  const zoomG = sel.append('g').attr('clip-path', `url(#${clipId})`)
  const g = zoomG.append('g') // transformed by the zoom behaviour

  const EDGE = { base: 'rgba(208,169,85,0.32)', dim: 'rgba(208,169,85,0.05)', width: 0.8 }

  const linkSel = g.append('g').selectAll<SVGLineElement, NetLink>('line').data(links).enter().append('line')
    .attr('x1', (d) => xy(d.source).x ?? 0).attr('y1', (d) => xy(d.source).y ?? 0)
    .attr('x2', (d) => xy(d.target).x ?? 0).attr('y2', (d) => xy(d.target).y ?? 0)
    .attr('stroke', EDGE.base).attr('stroke-width', EDGE.width).attr('opacity', 0)
  linkSel.transition().duration(800).attr('opacity', 1)

  const skillSel = g.append('g').selectAll<SVGCircleElement, NetNode>('circle').data(skills).enter().append('circle')
    .attr('cx', (d) => d.x ?? 0).attr('cy', (d) => d.y ?? 0).attr('r', 0)
    .attr('fill', C.skill).attr('opacity', 0.95).style('cursor', 'pointer')
  skillSel.transition().duration(450).delay((_, i) => i * 6).attr('r', (d) => d.r)

  const agSel = g.append('g').selectAll<SVGGElement, NetNode>('g').data(agents).enter().append('g').style('cursor', 'pointer')
  const agCircle = agSel.append('circle').attr('cx', (d) => d.x ?? 0).attr('cy', (d) => d.y ?? 0).attr('r', 0)
    .attr('fill', C.accent).attr('stroke', C.panel).attr('stroke-width', 2)
  agCircle.transition().duration(500).delay((_, i) => i * 30).attr('r', (d) => d.r)
  const agLabel = agSel.append('text')
    .attr('x', (d) => cx + (R + 16) * Math.cos(d.ang ?? 0))
    .attr('y', (d) => cy + (R + 16) * Math.sin(d.ang ?? 0))
    .attr('dy', '0.32em')
    .attr('text-anchor', (d) => {
      const c = Math.cos(d.ang ?? 0)
      return c > 0.3 ? 'start' : c < -0.3 ? 'end' : 'middle'
    })
    .attr('fill', C.textH).attr('font-size', '10px').attr('font-weight', 700)
    .attr('stroke', C.panel).attr('stroke-width', 3).attr('paint-order', 'stroke')
    .attr('opacity', 0).text((d) => d.label ?? '')
  agLabel.transition().duration(400).delay(600).attr('opacity', 1)

  // Floating SVG tooltip — rendered outside the zoom group so it stays fixed and on top.
  const ttip = sel.append('g').attr('pointer-events', 'none').attr('opacity', 0)
  const ttRect = ttip.append('rect').attr('rx', 5).attr('height', 34)
    .attr('fill', '#042830').attr('stroke', 'rgba(208,169,85,0.55)').attr('stroke-width', 1)
  const ttTitle = ttip.append('text').attr('fill', '#f4f0e7').attr('font-size', '11px').attr('font-weight', 700)
  const ttSub = ttip.append('text').attr('fill', '#b9ac90').attr('font-size', '9.5px')

  function showTip(event: MouseEvent, title: string, sub: string) {
    const [mx, my] = d3.pointer(event, sel.node() as Element)
    const px = Math.min(mx + 14, w - 180)
    const py = Math.max(my - 42, 4)
    ttTitle.attr('x', px + 8).attr('y', py + 14).text(title)
    ttSub.attr('x', px + 8).attr('y', py + 26).text(sub)
    const tw = Math.max(title.length * 6.5, sub.length * 5.5)
    ttRect.attr('x', px).attr('y', py).attr('width', tw + 16)
    ttip.attr('opacity', 1)
  }
  function hideTip() { ttip.attr('opacity', 0) }

  // hover: trace a node's connections
  const isOn = (a: string, id: string, nbr: Set<string>) => a === id || nbr.has(a)
  function highlight(id: string) {
    const nbr = neighbors.get(id) ?? new Set<string>()
    const active = new Set<number>(linkIdx.get(id) ?? [])
    linkSel.attr('stroke', (_, i) => (active.has(i) ? C.accent : EDGE.dim))
      .attr('stroke-width', (_, i) => (active.has(i) ? 1.8 : EDGE.width))
    skillSel.attr('opacity', (d) => (isOn(d.id, id, nbr) ? 1 : 0.1))
    agCircle.attr('opacity', (d) => (isOn(d.id, id, nbr) ? 1 : 0.18))
    agLabel.attr('opacity', (d) => (isOn(d.id, id, nbr) ? 1 : 0.15))
  }
  function reset() {
    linkSel.attr('stroke', EDGE.base).attr('stroke-width', EDGE.width)
    skillSel.attr('opacity', 0.95)
    agCircle.attr('opacity', 1)
    agLabel.attr('opacity', 1)
  }

  skillSel
    .on('mouseenter', (event, d) => {
      showTip(event as MouseEvent, d.label ?? '', `used by ${d.deg} agent${d.deg !== 1 ? 's' : ''}`)
      highlight(d.id)
    })
    .on('mouseleave', () => { hideTip(); reset() })

  agSel
    .on('mouseenter', (event, d) => {
      showTip(event as MouseEvent, d.label ?? '', `${d.deg ?? 0} skill${d.deg !== 1 ? 's' : ''}`)
      highlight(d.id)
    })
    .on('mouseleave', () => { hideTip(); reset() })

  // zoom + pan
  const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.6, 4])
    .on('zoom', (e) => g.attr('transform', e.transform.toString()))
  sel.call(zoom)

  // legend + hint (fixed, outside the zoom group)
  const lg = sel.append('g').attr('transform', 'translate(14,14)')
  lg.append('circle').attr('cx', 6).attr('cy', 6).attr('r', 6).attr('fill', C.accent)
  lg.append('text').attr('x', 18).attr('y', 6).attr('dy', '0.32em').attr('fill', C.textH).attr('font-size', '10px').text('Specialized agents')
  lg.append('circle').attr('cx', 6).attr('cy', 24).attr('r', 4).attr('fill', C.skill)
  lg.append('text').attr('x', 18).attr('y', 24).attr('dy', '0.32em').attr('fill', C.textH).attr('font-size', '10px').text('Shared skills (size = reuse)')
  sel.append('text').attr('x', w - 12).attr('y', height - 12).attr('text-anchor', 'end')
    .attr('fill', C.muted).attr('font-size', '9px').text('Hover to trace · scroll to zoom · drag to pan')
}

/* ------------------------------------------------------------------ */
/* HTML matrices                                                      */
/* ------------------------------------------------------------------ */

const domainRows: { domain: string; build: string; outcome: string }[] = [
  { domain: 'Ratings Workflow Solutions', build: 'Credit-ratings & supporting systems for Structured Finance, Public Finance & Sovereigns', outcome: 'Analysts focus on the rating — the rest is one click' },
  { domain: 'Institutional Clients (ICG)', build: 'Compliance analytics & regulatory testing for top institutional clients', outcome: '10× productivity across FINRA, CFPB & Basel II' },
  { domain: 'Commercial Wholesale', build: 'Collateral allocation & risk-calculation engine', outcome: 'Accurate collateral decomposition, no double-counting' },
  { domain: 'AML / KYC', build: 'Graph entity-resolution & screening pipelines', outcome: 'Regulatory-grade, audit-ready controls' },
]

function DomainMatrix() {
  const cols = '1.1fr 1.5fr 1.5fr'
  return (
    <div style={{ display: 'grid', gap: '1px', background: 'rgba(208,169,85,0.22)', border: '1px solid var(--accent-border)', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: cols, background: '#04262b' }}>
        {['Domain', 'What I build', 'Outcome'].map((h) => (
          <div key={h} style={{ padding: '0.6rem 0.9rem', fontSize: '0.7rem', fontWeight: 700, color: '#d4ad5e', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</div>
        ))}
      </div>
      {domainRows.map((r) => (
        <div key={r.domain} style={{ display: 'grid', gridTemplateColumns: cols, background: '#073b40' }}>
          <div style={{ padding: '0.7rem 0.9rem', fontSize: '0.82rem', fontWeight: 600, color: '#f4f0e7' }}>{r.domain}</div>
          <div style={{ padding: '0.7rem 0.9rem', fontSize: '0.8rem', color: '#c7b89b' }}>{r.build}</div>
          <div style={{ padding: '0.7rem 0.9rem', fontSize: '0.8rem', color: '#c7b89b' }}>{r.outcome}</div>
        </div>
      ))}
    </div>
  )
}

const cloudRows: { cap: string; aws: string; azure: string; gcp: string }[] = [
  { cap: 'Compute', aws: 'EC2 · Lambda', azure: 'VMs · Functions', gcp: 'Compute Engine · Cloud Run' },
  { cap: 'Containers', aws: 'EKS', azure: 'AKS', gcp: 'GKE' },
  { cap: 'Databases', aws: 'Aurora · RDS · DynamoDB', azure: 'SQL DB · Cosmos DB', gcp: 'Cloud SQL · Firestore' },
  { cap: 'Analytics', aws: 'Redshift · Athena', azure: 'Synapse', gcp: 'BigQuery' },
  { cap: 'Streaming', aws: 'MSK · SNS/SQS', azure: 'Event Hubs', gcp: 'Pub/Sub' },
  { cap: 'AI / ML', aws: 'Bedrock · Amazon Q', azure: 'Azure OpenAI', gcp: 'Vertex AI · Gemini' },
  { cap: 'IaC / DevOps', aws: 'CloudFormation', azure: 'ARM / Bicep', gcp: 'Deployment Mgr' },
]

function CloudMatrix() {
  const cols = '0.8fr 1.3fr 1.1fr 1.3fr'
  const headers = ['', 'AWS', 'Azure', 'GCP']
  return (
    <div style={{ display: 'grid', gap: '1px', background: 'rgba(208,169,85,0.22)', border: '1px solid var(--accent-border)', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: cols, background: '#04262b' }}>
        {headers.map((h, i) => (
          <div key={i} style={{ padding: '0.6rem 0.9rem', fontSize: '0.72rem', fontWeight: 700, color: i === 1 ? '#d4ad5e' : '#f4f0e7', letterSpacing: '0.03em' }}>{h}</div>
        ))}
      </div>
      {cloudRows.map((r) => (
        <div key={r.cap} style={{ display: 'grid', gridTemplateColumns: cols, background: '#073b40' }}>
          <div style={{ padding: '0.7rem 0.9rem', fontSize: '0.78rem', fontWeight: 600, color: '#f4f0e7' }}>{r.cap}</div>
          <div style={{ padding: '0.7rem 0.9rem', fontSize: '0.78rem', color: '#e8dcc2' }}>{r.aws}</div>
          <div style={{ padding: '0.7rem 0.9rem', fontSize: '0.78rem', color: '#c7b89b' }}>{r.azure}</div>
          <div style={{ padding: '0.7rem 0.9rem', fontSize: '0.78rem', color: '#c7b89b' }}>{r.gcp}</div>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */

const stats: { value: string; label: string }[] = [
  { value: '$1.4M/yr', label: 'Vendor fee eliminated' },
  { value: '+30%', label: 'Analyst productivity' },
  { value: '+20%', label: 'Developer productivity' },
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
        <p style={{ color: 'var(--text)', maxWidth: 580, margin: 0 }}>
          A visual snapshot of impact, domain depth, and the scale of teams and platforms I lead.
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1px',
          background: 'rgba(208,169,85,0.22)',
          border: '1px solid var(--accent-border)',
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: '1.75rem',
        }}
      >
        {stats.map(({ value, label }) => (
          <div key={label} style={{ background: 'linear-gradient(160deg, #073b40, #052b31)', padding: '1.25rem 1rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d4ad5e', letterSpacing: '-0.02em' }}>
              {value}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#c7b89b', marginTop: '0.25rem' }}>{label}</div>
          </div>
        ))}
      </div>

      <VizCard title="Cost-Savings Waterfall" subtitle="The vendor fee kept climbing — $500k, then $750k, then a $1.4M quote, with hikes going from every two years to annual. I replaced it with ephemeral Airflow-on-EKS — spin up, run the job, terminate, instead of 7 always-on 32 GB EC2 boxes — collapsing it to a pay-per-run ≈ $0.">
        <Chart draw={drawWaterfall} ariaLabel="Column chart showing the vendor fee escalating from 500 thousand to 750 thousand to 1.4 million dollars per year, then dropping to near zero after replacement with ephemeral Airflow on EKS, saving 1.4 million dollars a year" />
      </VizCard>

      <VizCard title="Domain Coverage" subtitle="Financial-services domains I've built in — the systems and the outcomes they drove.">
        <DomainMatrix />
      </VizCard>

      <VizCard title="Follow-the-Sun Coverage" subtitle="Distributed teams hand off across time zones for near-continuous delivery and support.">
        <Chart draw={drawFollowSun} ariaLabel="Time-zone coverage from India through the UK to Toronto, New York, and Chicago" />
      </VizCard>

      <VizCard title="Multi-Cloud Capability Matrix" subtitle="Equivalent building blocks across the three clouds I work in — AWS primary, Azure and GCP in production.">
        <CloudMatrix />
      </VizCard>

      <VizCard title="Agent & Skill Network" subtitle="67 real skills wired to 12 agents. Highly-shared skills cluster near the centre; specialized ones stay close to their agent. Hover any node to see its name — scroll to zoom, drag to pan.">
        <Chart draw={drawNetwork} ariaLabel="Radial network: specialized agents around a ring connected to shared reusable skills at the centre" />
      </VizCard>

      <VizCard title="AI-Assisted SDLC Operating Model" subtitle="A continuous CI/CD loop — agents and skills at every stage, with a governance gate between each.">
        <Chart draw={drawSdlc} ariaLabel="Continuous CI/CD loop from plan to operate with governance gates between stages" />
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--accent-border)', borderRadius: 10, overflow: 'hidden' }}>
          {techStack.map(({ category, items }, i) => (
            <div
              key={category}
              className="tech-row"
              style={{ background: i % 2 === 0 ? '#073b40' : '#052f34' }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d4ad5e', letterSpacing: '0.02em' }}>
                {category}
              </span>
              <span style={{ fontSize: '0.875rem', color: '#c7b89b', lineHeight: 1.6 }}>
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
  { category: 'Cloud & Platforms', items: 'AWS (EKS, Lambda, Glue, MSK, Aurora, Redshift), Azure, GCP, Kubernetes, serverless, event-driven' },
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
