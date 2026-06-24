import { Link } from 'react-router-dom'
import heroPaperCut from '../assets/hero-paper-cut.png'

const impactAreas = [
  {
    icon: <PlatformIcon />,
    title: 'Platform Strategy',
    body: 'Architecting resilient financial platforms that connect business outcomes to durable engineering systems.',
  },
  {
    icon: <GrowthIcon />,
    title: 'Data & AI Modernization',
    body: 'Turning trusted data, agentic workflows, and automation into decision velocity at enterprise scale.',
  },
  {
    icon: <ShieldIcon />,
    title: 'Ratings & Capital Markets',
    body: 'Building software across credit ratings and ratings workflows, capital markets, commercial and wholesale banking, and AML/KYC compliance.',
  },
  {
    icon: <CloudIcon />,
    title: 'Cloud Architecture',
    body: 'Designing secure, cost-aware cloud systems for high-throughput financial services workloads.',
  },
]

const platformStats = [
  ['30+', 'Engineers led'],
  ['Global', 'Delivery teams'],
  ['Multi-cloud', 'AWS · Azure · GCP'],
  ['AI', 'Enabled engineering'],
]

const teamAreas = [
  'Platform Engineering',
  'Data Engineering',
  'Application Engineering',
  'Cloud & SRE',
  'QA & Automation',
  'DevOps',
]

export default function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero__content">
          <p className="home-eyebrow">Director of Engineering · Financial Services · New York</p>
          <h1>
            <span className="home-title-line">
              Engineering <span className="home-title-mobile-break">Leadership</span>
            </span>
            <span className="home-title-line">
              At the <span className="home-title-mobile-break">Intersection of</span>
            </span>
            <span className="home-title-line home-title-accent">Markets, Data &amp; AI</span>
          </h1>
          <p className="home-hero__summary">
            Building resilient, scalable platforms that empower analysts,
            accelerate decisions, and drive measurable impact across global
            financial markets.
          </p>
          <div className="home-actions" aria-label="Primary actions">
            <Link to="/work">Explore My Work</Link>
            <a href="https://cal.com/shereefelias/30min" target="_blank" rel="noreferrer">
              Book a Call
            </a>
          </div>
        </div>

        <div className="home-hero__visual" aria-hidden="true">
          <img className="home-hero__paper-layer" src={heroPaperCut} alt="" />
        </div>
      </section>

      <section className="home-stat-band" aria-label="Platform leadership highlights">
        {platformStats.map(([value, label]) => (
          <div key={label} className="home-stat">
            <span>{value}</span>
            <p>{label}</p>
          </div>
        ))}
      </section>

      <section className="home-section">
        <div className="section-heading">
          <span />
          <h2>Core Areas of Impact</h2>
          <span />
        </div>
        <div className="impact-grid">
          {impactAreas.map(({ icon, title, body }) => (
            <article key={title} className="impact-item">
              <div className="impact-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-section--team">
        <div className="section-heading">
          <span />
          <h2>Teams I Build &amp; Lead</h2>
          <span />
        </div>
        <div className="team-grid">
          {teamAreas.map((area) => (
            <div key={area} className="team-item">
              <div className="team-icon"><GearIcon /></div>
              <p>{area}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

function PlatformIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="7" y="9" width="18" height="14" rx="2" />
      <path d="M11 13h10M11 17h6M16 23v4M10 27h12" />
    </svg>
  )
}

function GrowthIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M6 24h20M9 24v-7h4v7M15 24V11h4v13M21 24v-10h4v10" />
      <path d="M8 11l5-5 5 4 6-7" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 4l10 4v7c0 6-4 10-10 13C10 25 6 21 6 15V8l10-4z" />
      <path d="M12 16l3 3 6-7" />
    </svg>
  )
}

function CloudIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M11 24h12a6 6 0 0 0 1-11 8 8 0 0 0-15-2 6.5 6.5 0 0 0 2 13z" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 11a5 5 0 1 1 0 10 5 5 0 0 1 0-10z" />
      <path d="M16 4v4M16 24v4M6.8 8.8l2.8 2.8M22.4 22.4l2.8 2.8M4 16h4M24 16h4M6.8 23.2l2.8-2.8M22.4 9.6l2.8-2.8" />
    </svg>
  )
}
