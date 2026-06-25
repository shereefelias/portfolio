interface Diagram {
  id: number
  title: string
  company: string
  description: string
  detail: string
  tags: string[]
}

const diagrams: Diagram[] = [
  {
    id: 1,
    title: 'Federated Micro-Frontend Portal Architecture',
    company: 'Fitch Ratings',
    description: 'EKS-hosted federated portal platform where independent global teams each manage their own modular portal instance for their business group.',
    detail: 'Core challenge: multiple teams across distinct business domains, zero cross-team deployment coupling. Solution: each team owns a portal shell deployed to its own EKS namespace, composed via a shared component registry. No team can block another\'s release. GitOps via Argo CD drives all deployments with full audit trail.',
    tags: ['AWS EKS', 'Kubernetes', 'Micro-Frontends', 'Argo CD', 'GitOps', 'Module Federation'],
  },
  {
    id: 2,
    title: 'Event-Driven Ratings Workflow Platform',
    company: 'Fitch Ratings',
    description: 'Cloud-native event-driven architecture using Kafka and AWS Lambda for real-time ratings data processing across Structured Finance and Surveillance.',
    detail: 'Applied Domain-Driven Design principles to decompose the monolithic ratings workflow into bounded contexts. Each domain (deal onboarding, model execution, surveillance, reporting) publishes and consumes events via AWS MSK (Kafka). Apache Airflow orchestrates multi-step analytical workflows. Services containerized and deployed to EKS via Argo CD.',
    tags: ['Apache Kafka', 'AWS MSK', 'AWS Lambda', 'Apache Airflow', 'DDD', 'EKS'],
  },
  {
    id: 3,
    title: 'CMBS Hybrid-Cloud Event-Driven Platform',
    company: 'Fitch Ratings',
    description: 'Replacement for Rockport/Trepp vendor infrastructure — an in-house, event-driven platform on EKS for CMBS deal onboarding, financial model generation, and surveillance.',
    detail: 'Key design decisions: containerized, event-driven services on EKS with Apache Kafka for streaming and Apache Airflow orchestrating multi-step analytical workflows, fronted by FastAPI services. Transactional state lives in Aurora RDS (PostgreSQL) and MariaDB; a curated S3/Parquet data lake is queried through Starburst (Trino). Deployed through GitHub Actions CI/CD. Saved $1M+/year in vendor fees with 30% analyst productivity improvement.',
    tags: ['AWS EKS', 'Apache Airflow', 'FastAPI', 'Apache Kafka', 'Event-Driven', 'Aurora PostgreSQL', 'MariaDB', 'Starburst (Trino)', 'S3 / Parquet'],
  },
  {
    id: 4,
    title: 'AML Entity Resolution & Surveillance Analytics',
    company: 'Citigroup',
    description: 'Entity-resolution and data-mining system across AML and Global Compliance — modeling customer-risk relationships and transactional linkages for surveillance alerting.',
    detail: 'Core problem: surfacing suspicious relationships and linkages buried across high-volume accounts, entities, and transactions. Solution: advanced analytical SQL on Oracle and Microsoft SQL Server — set-based linkage and clustering logic — with SSIS pipelines feeding the data and SSAS cubes powering multidimensional analysis, plus Python for the heavier data-mining routines. Detection queries surface suspicious relationship clusters and transactional patterns for analyst review.',
    tags: ['Oracle', 'Microsoft SQL Server', 'SSIS', 'SSAS', 'Advanced Analytical SQL', 'Python', 'AML', 'Entity Resolution'],
  },
  {
    id: 5,
    title: 'Commercial Wholesale Collateral Risk Engine',
    company: 'Citigroup',
    description: 'Collateral allocation and risk calculation engine for Citi\'s Commercial Wholesale lending business — decomposing shared collateral across loan portfolios by priority tier.',
    detail: 'The problem: shared collateral across multiple loans was being counted multiple times, overstating collateral coverage and understating true risk exposure — a regulatory compliance failure. The engine implements priority-tier slicing logic: each collateral asset is allocated proportionally across loans by lien priority, ensuring no double-counting. Brought Citi into correct regulatory posture across its largest institutional clients.',
    tags: ['Java', 'Oracle', 'Risk Calculation', 'Basel II', 'Regulatory', 'Financial Modeling'],
  },
]

export default function SystemDesign() {
  return (
    <main className="page-main">
      <header className="page-hero">
        <span className="page-hero__eyebrow">Architecture &amp; Trade-offs</span>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800,
          letterSpacing: '-0.03em', margin: '0 0 0.5rem',
        }}>
          System Design
        </h1>
        <p style={{ maxWidth: 600, margin: 0, lineHeight: 1.7 }}>
          Architecture decisions, trade-off analyses, and platform designs from 20 years
          of building production systems in financial services. Interactive diagrams coming soon.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {diagrams.map((d) => (
          <DiagramCard key={d.id} diagram={d} />
        ))}
      </div>
    </main>
  )
}

function DiagramCard({ diagram }: { diagram: Diagram }) {
  return (
    <article className="content-card">
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-h)', margin: 0 }}>
              {diagram.title}
            </h2>
            <span style={{
              fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: 4,
              background: 'var(--accent-dim)', color: 'var(--accent)', fontWeight: 500, flexShrink: 0,
            }}>
              {diagram.company}
            </span>
          </div>

          <p style={{ fontSize: '0.925rem', color: 'var(--text-h)', margin: '0 0 0.5rem', fontWeight: 500, lineHeight: 1.6 }}>
            {diagram.description}
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text)', margin: '0 0 1rem', lineHeight: 1.7 }}>
            {diagram.detail}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {diagram.tags.map((tag) => (
              <span key={tag} style={{
                fontSize: '0.72rem', padding: '0.2rem 0.55rem', borderRadius: 4,
                background: 'var(--accent-dim)', color: 'var(--accent)', fontWeight: 500,
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div style={{
          width: 64, height: 64, borderRadius: 8, flexShrink: 0,
          background: 'var(--accent-dim)', border: '1px solid var(--accent-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <path d="M10 6.5h4M17.5 10v4M10 17.5h4M6.5 10v4" />
          </svg>
        </div>
      </div>
    </article>
  )
}
