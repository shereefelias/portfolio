export default function Home() {
  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 1.5rem', flex: 1 }}>
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 760 }}>

        <p style={{
          fontSize: '0.875rem', color: 'var(--accent)', fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0,
        }}>
          Engineering Manager · New York
        </p>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800,
          letterSpacing: '-0.03em', lineHeight: 1.05, color: 'var(--text-h)', margin: 0,
        }}>
          Shereef Elias
        </h1>

        <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent)', margin: 0 }}>
          Engineering Manager · AWS Certified · PMP · AI-Driven &amp; Cloud-Native
        </p>

        <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text)', margin: 0 }}>
          20+ years building and scaling engineering organizations in financial services.
          Director at <strong style={{ color: 'var(--text-h)' }}>Fitch Ratings</strong> leading
          30 engineers across 5 squads. Previously VP at <strong style={{ color: 'var(--text-h)' }}>Citigroup</strong>.
        </p>

        {/* Stats */}
        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.5rem' }}>
          {[
            { value: '20+', label: 'Years Experience' },
            { value: '30', label: 'Engineers Led' },
            { value: '5', label: 'Global Squads' },
            { value: '$1M+', label: 'Annual Savings' },
            { value: '10x', label: 'Compliance Productivity' },
            { value: '99.99%', label: 'Production Uptime' },
          ].map(({ value, label }) => (
            <div key={label} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '1.25rem',
            }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text)', marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div style={{ marginTop: '1rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Certifications
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {[
              'AWS Solutions Architect', 'Advanced Developing on AWS', 'Architecting on AWS',
              'Building Data Lakes on AWS', 'PMP', 'Azure Fundamentals', 'Azure Data Fundamentals',
              'Power BI for Managers', 'MongoDB Atlas', 'MongoDB Developer Foundation',
              'Confluent Kafka Developer', 'Domain-Driven Design', 'ITIL v3 Foundation',
              'Apache Airflow', 'Implementing CI/CD with GitHub Actions', 'Argo CD',
              'Talend Advanced Data Integration', 'Talend Big Data',
            ].map((cert) => (
              <span key={cert} style={{
                fontSize: '0.75rem', padding: '0.25rem 0.65rem', borderRadius: 20,
                border: '1px solid var(--accent-border)', color: 'var(--accent)',
                background: 'var(--accent-dim)',
              }}>
                {cert}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <a href="/viz" style={{
            fontSize: '0.875rem', color: 'var(--accent)', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          }}>
            View full tech stack &amp; infographics &rarr;
          </a>
        </div>

      </section>
    </main>
  )
}
