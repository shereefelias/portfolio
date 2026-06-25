import { Fragment } from 'react'
import photo from '../assets/portfolio_pic.jpg'
import careerImpact from '../assets/engineering-leadership-career-impact.webp'

export default function About() {
  return (
    <main className="page-main">

      {/* Photo + Bio */}
      <div className="about-hero page-hero">
        <div className="about-hero-photo" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <img
            src={photo}
            alt="Shereef Elias"
            style={{
              width: 220, height: 220, borderRadius: 16, objectFit: 'cover',
              border: '2px solid rgba(208,169,85,0.5)', display: 'block',
            }}
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="https://www.linkedin.com/in/shereefelias/" target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', textDecoration: 'none', fontSize: '0.85rem' }}
            >
              <LinkedInIcon /> LinkedIn
            </a>
            <a href="mailto:shereef.elias@gmail.com"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(244,240,231,0.85)', textDecoration: 'none', fontSize: '0.85rem' }}
            >
              <MailIcon /> Email
            </a>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800,
              letterSpacing: '-0.03em', margin: '0 0 0.25rem',
            }}>
              Shereef Elias
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--gold-strong)', fontWeight: 600, margin: 0 }}>
              Engineering Manager · AI Evangelist · AWS Certified · PMP
            </p>
          </div>

          <p style={{ fontSize: '1rem', lineHeight: 1.8, margin: 0 }}>
            20+ years building and scaling global engineering organizations across financial services.
            Currently leading a <strong>30+ engineer organization at Fitch Ratings</strong> that
            operates follow-the-sun across global time zones — spanning full-stack development, data pipeline engineering,
            ML/AI, and cloud architecture across Sovereigns, Structured Finance, Public Finance,
            Surveillance, and Cross-Sector platforms.
          </p>

          <p style={{ fontSize: '1rem', lineHeight: 1.8, margin: 0 }}>
            As the organization's <strong>AI Evangelist</strong>, originated the tribe's
            AI agent marketplace (14 agents, 93 skills) — adopted
            org-wide, compressing legacy system analysis from days to hours and delivery
            timelines from months to weeks. Hands-on where it matters most: architectural direction,
            design governance, POCs, and the organization's hardest technical problems.
          </p>

          <p style={{ fontSize: '1rem', lineHeight: 1.8, margin: 0 }}>
            Before Fitch, spent 8 years at <strong>Citigroup</strong> rising from Engineer to Vice President —
            building compliance analytics platforms, AML surveillance systems, and
            commercial wholesale risk engines that achieved a <strong>10x productivity gain</strong> in
            regulatory operations.
          </p>
        </div>
      </div>

      {/* Career Timeline */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-h)', margin: '0 0 2rem' }}>
          Career
        </h2>
        <Timeline items={career} dotFilled />
      </section>

      {/* Education Timeline */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-h)', margin: '0 0 2rem' }}>
          Education
        </h2>
        <Timeline items={education} dotFilled={false} />
      </section>

      {/* Career Impact Infographic */}
      <section>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-h)', margin: '0 0 1rem' }}>
          Engineering Leadership Impact
        </h2>
        <div className="content-card" style={{ overflow: 'hidden' }}>
          <img
            src={careerImpact}
            alt="Engineering Leadership Career Impact infographic"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }}
          />
        </div>
      </section>

    </main>
  )
}

interface TimelineItem {
  period: string
  title: string
  subtitle: string
  summary: string
  company?: string
}

function CompanyDivider({ name }: { name: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', margin: '0.25rem 0' }}>
      <span style={{
        fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--teal-700)', background: 'rgba(20,92,94,0.10)',
        border: '1px solid var(--accent-border)', borderRadius: 999,
        padding: '0.32rem 0.85rem', whiteSpace: 'nowrap',
      }}>
        {name}
      </span>
      <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--accent-border), transparent)' }} />
    </div>
  )
}

function Timeline({ items, dotFilled }: { items: TimelineItem[]; dotFilled: boolean }) {
  return (
    <div className="timeline-wrapper">
      {/* Vertical line — hidden on mobile via CSS */}
      <div className="timeline-line-v" style={{ left: 107 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {items.map((item, i) => (
          <Fragment key={item.title}>
            {item.company && item.company !== items[i - 1]?.company && (
              <CompanyDivider name={item.company} />
            )}
          <div className="timeline-row">
            {/* Date column — hidden on mobile via CSS */}
            <div className="timeline-date-col" style={{ textAlign: 'right', paddingTop: 4 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', whiteSpace: 'nowrap' }}>
                {item.period}
              </span>
            </div>

            {/* Dot + content */}
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'start' }}>
              <div
                className="timeline-dot"
                style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: dotFilled ? 'var(--accent)' : 'var(--surface)',
                  border: dotFilled ? 'none' : '2px solid var(--accent)',
                  flexShrink: 0, marginTop: 5,
                  boxShadow: dotFilled ? '0 0 0 3px var(--accent-dim)' : 'none',
                }}
              />
              <div>
                {/* Date shown only on mobile */}
                <span className="timeline-date-mobile">{item.period}</span>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-h)', margin: '0 0 0.15rem' }}>
                  {item.title}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--accent)', margin: '0 0 0.5rem', fontWeight: 500 }}>
                  {item.subtitle}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text)', margin: 0, lineHeight: 1.7 }}>
                  {item.summary}
                </p>
              </div>
            </div>
          </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}

const career: TimelineItem[] = [
  {
    period: '2021 – Present',
    title: 'Director, Engineering Manager — Ratings Workflow Solutions',
    subtitle: 'New York, NY',
    company: 'Fitch Ratings',
    summary: 'Lead a 30+ engineer global organization operating follow-the-sun across time zones. Own platform strategy, multi-year modernization roadmaps, and end-to-end ratings workflow delivery across Sovereigns, Structured Finance, Public Finance, Surveillance, and Cross-Sector platforms.',
  },
  {
    period: '2017 – 2021',
    title: 'Associate Director, Team Lead — Ratings Workflow Solutions',
    subtitle: 'New York, NY',
    company: 'Fitch Ratings',
    summary: 'Led the CMBS platform modernization replacing Rockport/Trepp vendor infrastructure with an in-house, event-driven hybrid-cloud platform on EKS — saving $1M+/year and improving analyst productivity by 30%. Built and scaled engineering teams across regions.',
  },
  {
    period: '2014 – 2017',
    title: 'Lead Developer — Ratings Workflow Solutions',
    subtitle: 'New York, NY',
    company: 'Fitch Ratings',
    summary: 'Hands-on technical lead for ratings workflow automation across Public Finance and Structured Finance. Established engineering standards and CI/CD practices later adopted across the tribe.',
  },
  {
    period: '2013 – 2014',
    title: 'Vice President — Institutional Clients Group (ICG)',
    subtitle: 'Long Island City, NY',
    company: 'Citigroup',
    summary: 'VP in the Institutional Clients Group — Citi\'s franchise serving its largest institutional clients. Led compliance analytics and regulatory testing automation across FINRA, AML/KYC, CFPB, and Basel II, delivering a 10x productivity gain.',
  },
  {
    period: '2012 – 2013',
    title: 'Vice President — Global Compliance',
    subtitle: 'Long Island City, NY',
    company: 'Citigroup',
    summary: 'Promoted to Vice President in Global Compliance. Designed entity-resolution and data-mining systems in advanced analytical SQL — modeling customer-risk relationships and transactional linkages for surveillance alerting.',
  },
  {
    period: '2010 – 2012',
    title: 'Assistant Vice President — Commercial Wholesale',
    subtitle: 'Long Island City, NY',
    company: 'Citigroup',
    summary: 'Relocated to Long Island City as Assistant Vice President to build the Commercial Wholesale collateral allocation and risk-calculation engine — priority-tier slicing that decomposed shared collateral across loan portfolios and eliminated the double-counting distorting regulatory risk exposure.',
  },
  {
    period: '2008 – 2010',
    title: 'Senior Developer — AML',
    subtitle: 'Tampa, FL',
    company: 'Citigroup',
    summary: 'Moved to Anti-Money-Laundering (AML) as Senior Developer, building screening and transaction-surveillance pipelines for regulatory-grade, audit-ready compliance.',
  },
  {
    period: '2006 – 2008',
    title: 'Developer — Procure-to-Pay (P2P)',
    subtitle: 'Tampa, FL',
    company: 'Citigroup',
    summary: 'Started at the Tampa campus as a Developer on Procure-to-Pay (P2P), automating purchasing and payment workflows across the bank\'s procurement operations.',
  },
]

const education: TimelineItem[] = [
  {
    period: '2011',
    title: 'M.S. Management Information Systems',
    subtitle: 'University of South Florida, Tampa, FL · GPA 3.9/4.0',
    summary: '',
  },
  {
    period: '2005',
    title: 'B.S. Civil Engineering — Structural Engineering',
    subtitle: 'Cairo University',
    summary: '',
  },
]

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 7 10-7" />
    </svg>
  )
}
