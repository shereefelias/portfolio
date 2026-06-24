import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'

interface NavItem {
  to: string
  label: string
}

const links: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/work', label: 'Work' },
  { to: '/advisory', label: 'Advisory' },
  { to: '/infographics', label: 'Infographics' },
  { to: '/system-design', label: 'System Design' },
  { to: '/about', label: 'About' },
]

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  display: 'block',
  padding: '0.45rem 0.2rem',
  borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: isActive ? 'var(--accent)' : 'var(--nav-text)',
  background: 'transparent',
  transition: 'color 0.15s, border-color 0.15s',
  textDecoration: 'none',
})

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 8px 30px rgba(6,49,59,0.08)',
        backdropFilter: 'blur(14px)',
      }}
    >
      <div className="nav-inner">
        <NavLink to="/" className="nav-brand" onClick={() => setIsOpen(false)}>
          <img
            src={logo}
            alt="Shereef Elias"
            className="nav-brand__mark"
          />
          <span className="nav-brand__text">
            <span>Shereef Elias</span>
            <span>Director of Engineering</span>
          </span>
        </NavLink>

        {/* Desktop links */}
        <ul className="nav-links">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} end={to === '/'} style={linkStyle}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Hamburger button (mobile only) */}
        <button
          className="nav-hamburger"
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <XIcon /> : <HamburgerIcon />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="nav-mobile-menu">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setIsOpen(false)}
              style={({ isActive }) => ({
                ...linkStyle({ isActive }),
                padding: '0.6rem 0.75rem',
                fontSize: '1rem',
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="19" y2="6" />
      <line x1="3" y1="11" x2="19" y2="11" />
      <line x1="3" y1="16" x2="19" y2="16" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="4" y1="4" x2="18" y2="18" />
      <line x1="18" y1="4" x2="4" y2="18" />
    </svg>
  )
}
