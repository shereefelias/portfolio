type ProjectStatus = 'Production' | 'Greenfield' | 'Delivered' | 'Legacy Replaced'

interface Project {
  id: number
  title: string
  company: string
  period: string
  description: string
  detail: string
  tags: string[]
  status: ProjectStatus
  metric?: string
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Enterprise AI Developer Accelerator',
    company: 'Fitch Ratings',
    period: '2023 – Present',
    description: 'Originated and built the tribe\'s internal AI agent marketplace — 14 agents and 93 skills published to company GitHub, adopted org-wide across all teams.',
    detail: 'Enables AI-assisted code generation, full-codebase legacy analysis, automated bug scanning, and 3-tier system documentation. Compressed legacy system analysis from days to hours and eliminated documentation backlogs across a 30-person organization. Defined the tribe\'s AI-SDLC standard — every project now embeds AI instructions, skills, and agent definitions with prompt evaluation and governance guardrails.',
    tags: ['Claude Code', 'GitHub Copilot', 'AWS DLC', 'Python', 'AI Agents', 'SDLC Governance'],
    status: 'Production',
    metric: '20% productivity gain tracked via KRIs',
  },
  {
    id: 2,
    title: 'Federated IDP & Portal Platform',
    company: 'Fitch Ratings',
    period: '2022 – Present',
    description: 'Conceived and architected a federated portal model — an EKS-hosted platform where each global team independently manages a modular portal instance.',
    detail: 'Eliminated cross-team UI coupling and deployment dependencies that had locked teams into coordinated releases. Each business group (Sovereigns, Structured Finance, Public Finance, Surveillance, Cross-Sector) independently deploys its portal without touching the others — cutting cross-team dependencies and shortening release cycles to weeks.',
    tags: ['AWS EKS', 'Kubernetes', 'Micro-Frontends', 'Argo CD', 'GitOps'],
    status: 'Production',
    metric: 'Independent squad releases',
  },
  {
    id: 3,
    title: 'Climate Risk Ratings Platform',
    company: 'Fitch Ratings',
    period: '2021 – 2023',
    description: 'Enterprise-wide climate risk assessment engine generating climate-adjusted ratings and exposure metrics across all Fitch analytical systems.',
    detail: 'Unified cloud-native architecture supporting 1,000+ analysts and the MDT modeling team. Integrates with all existing Fitch analytical platforms to overlay climate risk adjustments on top of standard ratings workflows. Built under a multi-year modernization roadmap with zero disruption to live ratings production.',
    tags: ['AWS', 'Python', 'Data Pipelines', 'Apache Airflow', 'Microservices'],
    status: 'Production',
    metric: '1,000+ analysts supported',
  },
  {
    id: 4,
    title: 'Enterprise Workflow Automation',
    company: 'Fitch Ratings',
    period: '2021 – Present',
    description: 'Led Talend and Decisions.com workflow automation across DevOps, InfoSec, and SRE — replacing manual operational handoffs with governed, automated pipelines.',
    detail: 'Standardized data ingestion and workflow orchestration across Public Finance, Structured Finance, Surveillance, and Cross-Sector platforms. Automated cross-functional operational workflows spanning DevOps, InfoSec, and SRE, achieving 99.999% platform uptime across the critical ratings workflow estate.',
    tags: ['Talend', 'Decisions.com', 'Workflow Automation', 'DevOps', 'SRE', 'InfoSec'],
    status: 'Production',
    metric: '99.999% uptime',
  },
  {
    id: 5,
    title: 'CMBS Platform Modernization',
    company: 'Fitch Ratings',
    period: '2018 – 2021',
    description: 'Build-vs-buy decision and full replacement of Rockport/Trepp vendor infrastructure with an in-house, event-driven hybrid-cloud platform on EKS.',
    detail: 'Led the business case, architecture, and delivery of an in-house platform replacing two enterprise vendor products. The new platform gives Fitch full control over the CMBS data pipeline, deal onboarding, and surveillance workflows. Achieved 30% analyst productivity improvement and $1M+ annual savings in vendor fees.',
    tags: ['Apache Airflow', 'FastAPI', 'AWS EKS', 'Oracle', 'Aurora PostgreSQL', 'MariaDB', 'Starburst (Trino)', 'Apache Kafka', 'Event-Driven', 'S3 / Parquet', 'Python'],
    status: 'Legacy Replaced',
    metric: '$1M+/year saved · 30% productivity gain',
  },
  {
    id: 6,
    title: 'Compliance Analytics & AML Surveillance',
    company: 'Citigroup',
    period: '2006 – 2014',
    description: 'Within the Institutional Clients Group (ICG), built and deployed compliance analytics platforms automating manual regulatory testing workflows across FINRA, AML/KYC, CFPB, and Basel II obligations.',
    detail: 'Progressed from Developer to Vice President across ICG. Built entity-resolution and data-mining systems across AML and Global Compliance using advanced analytical SQL on Oracle and Microsoft SQL Server — with SSIS pipelines, SSAS cubes, and Python — to model customer-risk relationships and transactional linkages. Also engineered the Commercial Wholesale collateral and risk-calculation engine, implementing priority-tier slicing logic to correctly decompose shared collateral across loan portfolios — eliminating the double-counting that was distorting the bank\'s regulatory risk exposure.',
    tags: ['Oracle', 'Microsoft SQL Server', 'SSIS', 'SSAS', 'Python', 'Advanced Analytical SQL', 'AML', 'Basel II', 'FINRA'],
    status: 'Delivered',
    metric: '10x compliance productivity gain',
  },
]

const statusColor: Record<ProjectStatus, string> = {
  Production: '#22c55e',
  Greenfield: 'var(--accent)',
  Delivered: '#94a3b8',
  'Legacy Replaced': '#f59e0b',
}

export default function Work() {
  return (
    <main className="page-main">
      <header className="page-hero">
        <span className="page-hero__eyebrow">Selected Work</span>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800,
          letterSpacing: '-0.03em', margin: '0 0 0.5rem',
        }}>
          Work
        </h1>
        <p style={{ maxWidth: 600, margin: 0, lineHeight: 1.7 }}>
          20+ years of platform engineering, team leadership, and AI-driven modernization across
          financial services — Fitch Ratings and Citigroup. These are the projects that moved the needle.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </main>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="content-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-h)', margin: '0 0 0.2rem' }}>
            {project.title}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text)', margin: 0 }}>
            {project.company} · {project.period}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem', flexShrink: 0 }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: statusColor[project.status] }}>
            {project.status}
          </span>
          {project.metric && (
            <span style={{
              fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: 4,
              background: 'var(--accent-dim)', color: 'var(--accent)', fontWeight: 500,
            }}>
              {project.metric}
            </span>
          )}
        </div>
      </div>

      <p style={{ fontSize: '0.925rem', color: 'var(--text-h)', margin: '0 0 0.5rem', fontWeight: 500, lineHeight: 1.6 }}>
        {project.description}
      </p>
      <p style={{ fontSize: '0.875rem', color: 'var(--text)', margin: '0 0 1rem', lineHeight: 1.7 }}>
        {project.detail}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {project.tags.map((tag) => (
          <span key={tag} style={{
            fontSize: '0.72rem', padding: '0.2rem 0.55rem', borderRadius: 4,
            background: 'var(--accent-dim)', color: 'var(--accent)', fontWeight: 500,
          }}>
            {tag}
          </span>
        ))}
      </div>
    </article>
  )
}
