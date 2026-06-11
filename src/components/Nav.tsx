import { NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'

interface NavItem {
  to: string
  label: string
}

const links: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/work', label: 'Work' },
  { to: '/viz', label: 'Infographics' },
  { to: '/system-design', label: 'System Design' },
  { to: '/about', label: 'About' },
]

export default function Nav() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--nav-bg)',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 96,
        }}
      >
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src={logo}
            alt="Shereef Elias"
            style={{ height: 80, width: 'auto', display: 'block' }}
          />
        </NavLink>

        <ul
          style={{
            display: 'flex',
            gap: '0.25rem',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '0.375rem 0.75rem',
                  borderRadius: 6,
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--accent)' : 'var(--nav-text)',
                  background: isActive ? 'var(--accent-dim)' : 'transparent',
                  transition: 'color 0.15s, background 0.15s',
                  textDecoration: 'none',
                })}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
