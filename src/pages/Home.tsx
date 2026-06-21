import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <main className="page-main-home">
      <section style={{ display: 'flex', flexDirection: 'column', maxWidth: 880 }}>

        {/* Eyebrow */}
        <p style={{
          fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 1.75rem',
        }}>
          Director of Engineering · AI Evangelist · Financial Services · New York
        </p>

        {/* Name */}
        <h1 style={{
          fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 800,
          letterSpacing: '-0.04em', lineHeight: 1, color: 'var(--text-h)',
          margin: '0 0 2rem',
        }}>
          Shereef<br />Elias
        </h1>

        {/* Positioning */}
        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', lineHeight: 1.75,
          color: 'var(--text)', margin: '0 0 3.5rem', maxWidth: 680,
        }}>
          Twenty years engineering at the intersection of Wall Street and
          enterprise technology. VP at{' '}
          <strong style={{ color: 'var(--text-h)', fontWeight: 700 }}>Citigroup</strong>.
          {' '}Director of Engineering at{' '}
          <strong style={{ color: 'var(--text-h)', fontWeight: 700 }}>Fitch Ratings</strong>,
          {' '}driving AI and cloud transformation across global enterprise platforms.
        </p>

        {/* Three pillars */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '1px',
          background: 'var(--border)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: '3.5rem',
        }}>
          {[
            {
              label: 'Wall Street Depth',
              body: 'AML surveillance, credit ratings, regulatory compliance, and wholesale risk engineering — at two of the most demanding financial institutions on the planet. Built systems that cannot fail.',
            },
            {
              label: 'Organization at Scale',
              body: 'A 30+ engineer organization operating follow-the-sun across global time zones. End-to-end ownership: hiring, architecture governance, delivery roadmaps, and the culture that makes it run.',
            },
            {
              label: 'AI & Cloud Leadership',
              body: 'Originated a 14-agent, 93-skill internal AI marketplace — adopted org-wide. Cut legacy analysis from days to hours. $1M+/year in cloud savings delivered.',
            },
          ].map(({ label, body }) => (
            <div key={label} style={{
              background: 'var(--surface)',
              padding: '2rem 1.75rem',
              borderTop: '3px solid var(--accent)',
            }}>
              <p style={{
                fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent)',
                letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 0.9rem',
              }}>
                {label}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.75, margin: 0 }}>
                {body}
              </p>
            </div>
          ))}
        </div>

        {/* CTA block */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '2rem 2.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          marginBottom: '3.5rem',
        }}>
          <div>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-h)', margin: '0 0 0.35rem' }}>
              Available for advisory &amp; fractional leadership
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
              Scaling an engineering org. Navigating AI adoption. Building Wall Street-grade technical infrastructure.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0, flexWrap: 'wrap' }}>
            <Link to="/work" style={{
              fontSize: '0.875rem', padding: '0.65rem 1.25rem', borderRadius: 8,
              border: '1px solid var(--accent-border)',
              background: 'var(--accent-dim)', color: 'var(--accent)',
              textDecoration: 'none', fontWeight: 600,
            }}>
              View Work
            </Link>
            <a href="https://cal.com/shereefelias/30min" target="_blank" rel="noreferrer" style={{
              fontSize: '0.875rem', padding: '0.65rem 1.25rem', borderRadius: 8,
              background: 'var(--accent)', color: '#0f0f0f',
              textDecoration: 'none', fontWeight: 700,
            }}>
              Book a Call →
            </a>
          </div>
        </div>

        {/* Certifications — understated */}
        <div>
          <p style={{
            fontSize: '0.68rem', color: 'var(--text)', letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: '0.75rem', opacity: 0.55,
          }}>
            Certifications
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {[
              'AWS Solutions Architect', 'PMP — Project Management Professional (PMI)',
            ].map((cert) => (
              <span key={cert} style={{
                fontSize: '0.72rem', padding: '0.2rem 0.55rem', borderRadius: 20,
                border: '1px solid var(--border)', color: 'var(--text)',
              }}>
                {cert}
              </span>
            ))}
          </div>
        </div>

      </section>
    </main>
  )
}
