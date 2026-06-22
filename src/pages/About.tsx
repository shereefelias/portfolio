import photo from '../assets/portfolio_pic.jpg'
import careerImpact from '../assets/engineering-leadership-career-impact.webp'

export default function About() {
  return (
    <main className="page-main">

      {/* Photo + Bio */}
      <div className="about-hero">
        <div className="about-hero-photo" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <img
            src={photo}
            alt="Shereef Elias"
            style={{
              width: 220, height: 220, borderRadius: 16, objectFit: 'cover',
              border: '2px solid var(--border)', display: 'block',
            }}
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="https://www.linkedin.com/in/shereefelias/" target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', textDecoration: 'none', fontSize: '0.85rem' }}
            >
              <LinkedInIcon /> LinkedIn
            </a>
            <a href="mailto:shereef.elias@gmail.com"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text)', textDecoration: 'none', fontSize: '0.85rem' }}
            >
              <MailIcon /> Email
            </a>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800,
              letterSpacing: '-0.03em', color: 'var(--text-h)', margin: '0 0 0.25rem',
            }}>
              Shereef Elias
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--accent)', fontWeight: 600, margin: 0 }}>
              Engineering Manager · AI Evangelist · AWS Certified · PMP
            </p>
          </div>

          <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text)', margin: 0 }}>
            20+ years building and scaling global engineering organizations across financial services.
            Currently leading a <strong style={{ color: 'var(--text-h)' }}>30+ engineer organization at Fitch Ratings</strong> that
            operates follow-the-sun across global time zones — spanning full-stack development, data pipeline engineering,
            ML/AI, and cloud architecture across Sovereigns, Structured Finance, Public Finance,
            Surveillance, and Cross-Sector platforms.
          </p>

          <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text)', margin: 0 }}>
            As the organization's <strong style={{ color: 'var(--text-h)' }}>AI Evangelist</strong>, originated the tribe's
            AI agent marketplace (14 agents, 93 skills) — adopted
            org-wide, compressing legacy system analysis from days to hours and delivery
            timelines from months to weeks. Hands-on where it matters most: architectural direction,
            design governance, POCs, and the organization's hardest technical problems.
          </p>

          <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text)', margin: 0 }}>
            Before Fitch, spent 8 years at <strong style={{ color: 'var(--text-h)' }}>Citigroup</strong> rising from Engineer to Vice President —
            building compliance analytics platforms, AML graph-based surveillance systems, and
            commercial wholesale risk engines that achieved a <strong style={{ color: 'var(--text-h)' }}>10x productivity gain</strong> in
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

      {/* Career Impact Infographic */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-h)', margin: '0 0 1rem' }}>
          Engineering Leadership Impact
        </h2>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '1.5rem', overflow: 'hidden',
        }}>
          <img
            src={careerImpact}
            alt="Engineering Leadership Career Impact infographic"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }}
          />
        </div>
      </section>

      {/* Education Timeline */}
      <section>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-h)', margin: '0 0 2rem' }}>
          Education
        </h2>
        <Timeline items={education} dotFilled={false} />
      </section>

    </main>
  )
}

interface TimelineItem {
  period: string
  title: string
  subtitle: string
  summary: string
}

function Timeline({ items, dotFilled }: { items: TimelineItem[]; dotFilled: boolean }) {
  return (
    <div className="timeline-wrapper">
      {/* Vertical line — hidden on mobile via CSS */}
      <div className="timeline-line-v" style={{ left: 107 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {items.map((item) => (
          <div key={item.title} className="timeline-row">
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
        ))}
      </div>
    </div>
  )
}

const career: TimelineItem[] = [
  {
    period: '2021 – Present',
    title: 'Director, Engineering Manager — Ratings Workflow Solutions',
    subtitle: 'Fitch Ratings',
    summary: 'Lead a 30+ engineer global organization operating follow-the-sun across time zones. Own platform strategy, multi-year modernization roadmaps, and end-to-end ratings workflow delivery across Sovereigns, Structured Finance, Public Finance, Surveillance, and Cross-Sector platforms.',
  },
  {
    period: '2017 – 2021',
    title: 'Associate Director, Team Lead — Ratings Workflow Solutions',
    subtitle: 'Fitch Ratings',
    summary: 'Led the CMBS platform modernization replacing Rockport/Trepp vendor infrastructure with an in-house hybrid cloud serverless platform — saving $1M+/year and improving analyst productivity by 30%. Built and scaled engineering teams across regions.',
  },
  {
    period: '2014 – 2017',
    title: 'Lead Developer — Ratings Workflow Solutions',
    subtitle: 'Fitch Ratings',
    summary: 'Hands-on technical lead for ratings workflow automation across Public Finance and Structured Finance. Established engineering standards and CI/CD practices later adopted across the tribe.',
  },
  {
    period: '2006 – 2014',
    title: 'Vice President, Application Manager',
    subtitle: 'Citigroup',
    summary: '8 years, 5 promotions from Engineer to VP. Built compliance analytics platforms (10x productivity gain), AML graph-based entity-resolution systems, and the Commercial Wholesale Collateral Risk Engine across FINRA, AML/KYC, CFPB, and Basel II.',
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
