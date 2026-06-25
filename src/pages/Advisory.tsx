interface Client {
  id: number
  company: string
  url: string
  location: string
  industry: string
  period: string
  description: string
  detail: string
  focus: string[]
  impact?: string
}

const clients: Client[] = [
  {
    id: 1,
    company: 'Potoo Solutions',
    url: 'https://potoosolutions.com',
    location: 'Westport, CT',
    industry: 'Brand Protection',
    period: '2013 – 2021',
    description: 'Full-spectrum technical and business advisor from the company\'s first day — guiding an 8-year journey from Excel spreadsheets to a multi-region AWS enterprise platform now valued at over $10 million.',
    detail: 'Joined the founders at the very beginning, when the entire operation ran on Excel. Guided every step of the technology evolution: structured data first into advanced VBA macros, then migrated into Microsoft Access for relational structure, then led the full leap to AWS cloud — architecting production infrastructure across SQS, SNS, EKS, Aurora (multi-region), and the full enterprise services stack. Beyond infrastructure, handled every layer of the business: desktop procurement and setup, email systems, domain and identity management, hiring strategy for engineering and business roles, onboarding and hands-on training for incoming engineers, and guidance on how enterprise operations actually run at scale. Potoo is now a trusted brand-protection enforcement platform working with major global brands, headquartered in Westport, CT.',
    focus: ['Excel → VBA → Access → AWS', 'EKS · SQS · SNS · Aurora Multi-Region', 'IT Infrastructure & Desktop Setup', 'Email & Identity Systems', 'Engineering Hiring & Onboarding', 'Engineer Training', 'Enterprise Operations', 'Business Strategy'],
    impact: '$10M+ valuation · 8-year journey',
  },
  {
    id: 2,
    company: 'HK Towing',
    url: 'https://hk-towing.com',
    location: 'Greenville, SC',
    industry: 'Transportation & Roadside Assistance',
    period: '2025 – Present',
    description: 'End-to-end advisor on all IT, operations, and digital visibility for a growing towing company — from security cameras to search rankings.',
    detail: 'Built the entire technology and operational foundation from scratch. Designed and deployed the CCTV surveillance setup for the yard and fleet. Built the business website, established local SEO, and set up and optimized the Google Maps and Apple Maps listings to drive inbound calls and service requests. Advising on operational workflows, tools, and processes so the business runs efficiently as it scales. Every decision — from which software to buy, to how the phones are answered, to how customers find them online — has been guided with a hands-on approach.',
    focus: ['Website Build', 'Local SEO', 'Google Maps & Apple Maps', 'CCTV & Physical Security', 'IT Infrastructure', 'Operational Workflow', 'Customer Targeting'],
    impact: 'Zero to fully operational digital presence',
  },
  {
    id: 3,
    company: 'Access Egypt Travel',
    url: 'https://accessegypttravel.com',
    location: 'Remote',
    industry: 'Travel & Tourism',
    period: '2026 – Present',
    description: 'Strategic advisor rebuilding the business from the ground up — refining tour offerings, building an SEO strategy, and cleaning up social media presence to attract the right clientele.',
    detail: 'Working with the founders to rethink and restructure their tour packages and service offerings for clarity and market fit. Developing a targeted SEO plan to attract English-speaking travelers searching for Egypt tours. Cleaned up and professionalized their Facebook and Instagram presence — eliminating noise, standardizing visual identity, and building a content strategy designed to increase visibility and foot traffic from organic social. Also advising on how to present the brand to stand out in a competitive travel market.',
    focus: ['Tour Offering Refinement', 'SEO Strategy', 'Facebook & Instagram Cleanup', 'Social Media Visibility', 'Content Strategy', 'Brand Positioning', 'Customer Acquisition'],
    impact: 'Advisory from founding',
  },
]

export default function Advisory() {
  return (
    <main className="page-main">
      <header className="page-hero">
        <span className="page-hero__eyebrow">Founding Technical Advisor</span>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800,
          letterSpacing: '-0.03em', margin: '0 0 0.5rem',
        }}>
          Advisory
        </h1>
        <p style={{ maxWidth: 660, margin: 0, lineHeight: 1.7 }}>
          Outside of my full-time roles I've served as a founding technical advisor to early-stage
          companies — covering everything from IT infrastructure and cloud architecture to SEO,
          social media, operations, hiring, and how enterprise businesses actually run.
          Hands-on from day one, across every layer of the stack and the business.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {clients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </main>
  )
}

function ClientCard({ client }: { client: Client }) {
  return (
    <article className="content-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-h)', margin: '0 0 0.2rem' }}>
            {client.company}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <a
              href={client.url}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '0.78rem', color: 'var(--accent)', textDecoration: 'none', opacity: 0.85 }}
            >
              {client.url.replace('https://', '')}
            </a>
            <span style={{ fontSize: '0.78rem', color: 'var(--text)' }}>· {client.location} · {client.period}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem', flexShrink: 0 }}>
          <span style={{
            fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: 4,
            background: 'var(--accent-dim)', color: 'var(--accent)', fontWeight: 600,
          }}>
            {client.industry}
          </span>
          {client.impact && (
            <span style={{
              fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: 4,
              background: 'var(--accent-dim)', color: 'var(--accent)', fontWeight: 500,
            }}>
              {client.impact}
            </span>
          )}
        </div>
      </div>

      <p style={{ fontSize: '0.925rem', color: 'var(--text-h)', margin: '0.75rem 0 0.5rem', fontWeight: 500, lineHeight: 1.6 }}>
        {client.description}
      </p>
      <p style={{ fontSize: '0.875rem', color: 'var(--text)', margin: '0 0 1rem', lineHeight: 1.7 }}>
        {client.detail}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {client.focus.map((tag) => (
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
