import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface ChartDatum {
  label: string
  value: number
}

const chartData: ChartDatum[] = [
  { label: 'Systems', value: 92 },
  { label: 'Frontend', value: 84 },
  { label: 'Data Eng', value: 88 },
  { label: 'ML Ops', value: 71 },
  { label: 'DevOps', value: 79 },
  { label: 'Security', value: 65 },
]

export default function Viz() {
  return (
    <main className="page-main">
      <header style={{ marginBottom: '3rem' }}>
        <h1
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-h)',
            margin: '0 0 0.5rem',
          }}
        >
          Visualizations
        </h1>
        <p style={{ color: 'var(--text)', maxWidth: 520, margin: 0 }}>
          Data visualization and infographic work built with D3.js.
          This section will house interactive charts, dashboards, and
          exploratory data pieces.
        </p>
      </header>

      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '2rem',
          maxWidth: 640,
        }}
      >
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--text-h)',
            marginBottom: '0.25rem',
          }}
        >
          Skill Proficiency
        </h2>
        <p style={{ fontSize: '0.825rem', color: 'var(--text)', marginBottom: '1.5rem' }}>
          Relative proficiency scores across engineering disciplines (D3 bar chart)
        </p>
        <BarChart data={chartData} />
      </div>

      {/* Tech Stack */}
      <section style={{ marginTop: '4rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-h)', margin: '0 0 0.4rem' }}>
            Tech Stack
          </h2>
          <p style={{ color: 'var(--text)', fontSize: '0.875rem', margin: 0 }}>
            Full technology inventory — interactive infographic coming soon.
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

function BarChart({ data }: { data: ChartDatum[] }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const render = () => {
      if (!svgRef.current) return

      const svg = d3.select(svgRef.current)
      svg.selectAll('*').remove()

      const margin = { top: 10, right: 20, bottom: 36, left: 44 }
      const totalWidth = svgRef.current.clientWidth || 400
      const width = totalWidth - margin.left - margin.right
      const height = 220 - margin.top - margin.bottom

      const g = svg
        .attr('width', totalWidth)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.label))
        .range([0, width])
        .padding(0.3)

      const y = d3.scaleLinear().domain([0, 100]).range([height, 0])

      g.selectAll('.grid-line')
        .data(y.ticks(5))
        .enter()
        .append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', (d) => y(d))
        .attr('y2', (d) => y(d))
        .attr('stroke', '#262626')
        .attr('stroke-dasharray', '3,3')

      g.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d) => x(d.label) ?? 0)
        .attr('y', height)
        .attr('width', x.bandwidth())
        .attr('height', 0)
        .attr('rx', 4)
        .attr('fill', '#00d9ff')
        .attr('opacity', 0.85)
        .transition()
        .duration(600)
        .delay((_, i) => i * 80)
        .attr('y', (d) => y(d.value))
        .attr('height', (d) => height - y(d.value))

      g.selectAll('.bar-label')
        .data(data)
        .enter()
        .append('text')
        .attr('x', (d) => (x(d.label) ?? 0) + x.bandwidth() / 2)
        .attr('y', (d) => y(d.value) - 5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#00d9ff')
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .attr('opacity', 0)
        .text((d) => d.value)
        .transition()
        .delay((_, i) => i * 80 + 600)
        .attr('opacity', 1)

      g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(0))
        .call((axis) => {
          axis.select('.domain').attr('stroke', '#262626')
          axis.selectAll('text')
            .attr('fill', '#a3a3a3')
            .attr('font-size', '11px')
            .attr('dy', '1.2em')
        })

      g.append('g')
        .call(d3.axisLeft(y).ticks(5).tickFormat((d) => `${d}`))
        .call((axis) => {
          axis.select('.domain').remove()
          axis.selectAll('.tick line').remove()
          axis.selectAll('text')
            .attr('fill', '#a3a3a3')
            .attr('font-size', '11px')
        })
    }

    render()

    const observer = new ResizeObserver(render)
    if (containerRef.current) observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [data])

  return (
    <div ref={containerRef}>
      <svg
        ref={svgRef}
        style={{ width: '100%', display: 'block', overflow: 'visible' }}
        aria-label="Bar chart showing skill proficiency scores"
      />
    </div>
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
