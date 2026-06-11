import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import logo from './assets/logo.png'
import Nav from './components/Nav'
import Home from './pages/Home'
import Work from './pages/Work'
import Viz from './pages/Viz'
import SystemDesign from './pages/SystemDesign'
import About from './pages/About'

function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <footer style={{
        background: 'var(--footer-bg)',
        borderTop: '1px solid #e2e8f0',
        padding: '2.5rem 1.5rem',
        color: 'var(--footer-text)',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1.5rem',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-start' }}>
            <img src={logo} alt="Shereef Elias" style={{ height: 64, width: 'auto', display: 'block' }} />
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>
              &copy; {new Date().getFullYear()} Shereef Elias. All rights reserved.
            </p>
          </div>

          <div style={{
            display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start',
            background: '#e8edf2', border: '1px solid #cbd5e1', borderRadius: 10,
            padding: '0.875rem 1.25rem',
          }}>
            <a href="mailto:shereef.elias@gmail.com" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              color: '#0d1b2a', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
            }}>
              <MailIcon /> Email
            </a>
            <a href="https://www.linkedin.com/in/shereefelias/" target="_blank" rel="noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              color: '#0d1b2a', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
            }}>
              <LinkedInIcon /> LinkedIn
            </a>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              fontSize: '0.875rem', color: '#94a3b8',
            }}>
              <VideoIcon /> Zoom — <em>coming soon</em>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'work', element: <Work /> },
      { path: 'viz', element: <Viz /> },
      { path: 'system-design', element: <SystemDesign /> },
      { path: 'about', element: <About /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 7 10-7" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function VideoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="m22 8-6 4 6 4V8z" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  )
}
