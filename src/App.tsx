import { lazy, Suspense, useEffect } from 'react'
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom'
import logo from './assets/logo.webp'
import Nav from './components/Nav'
import ConsentBanner from './components/ConsentBanner'
import Home from './pages/Home'
import Work from './pages/Work'
import SystemDesign from './pages/SystemDesign'
import About from './pages/About'
import Advisory from './pages/Advisory'
import { routeMeta, DEFAULT_META } from './seo'

// D3-heavy — code-split so it only loads when the Infographics route is visited.
const Infographics = lazy(() => import('./pages/Infographics'))

// Keeps document.title and the meta description in sync on client-side
// navigation. (Per-route static HTML with the same tags is also emitted at
// build time by the seoPrerender plugin in vite.config.ts.)
function RouteMeta() {
  const { pathname } = useLocation()
  useEffect(() => {
    const meta = routeMeta[pathname] ?? DEFAULT_META
    document.title = meta.title
    let tag = document.querySelector('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'description')
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', meta.description)
  }, [pathname])
  return null
}

function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <RouteMeta />
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Nav />
      <div id="main-content" style={{ flex: 1 }}>
        <Outlet />
      </div>
      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <img src={logo} alt="Shereef Elias" width={82} height={82} />
            <div>
              <p>Shereef Elias</p>
              <span>Director of Engineering</span>
              <small>
                Engineering leader driving cloud, data, and AI powered
                solutions for capital markets and risk platforms.
              </small>
            </div>
          </div>

          <div className="site-footer__nav">
            <p>Navigation</p>
            <div>
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/advisory">Advisory</a>
              <a href="/work">Work</a>
              <a href="/infographics">Infographics</a>
              <a href="/system-design">System Design</a>
            </div>
          </div>

          <div className="site-footer__connect">
            <p>Connect</p>
            <div className="site-footer__links" aria-label="Contact links">
              <a href="mailto:shereef.elias@gmail.com" aria-label="Email">
              <MailIcon /> Email
              </a>
              <a href="https://www.linkedin.com/in/shereefelias/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <LinkedInIcon /> LinkedIn
              </a>
              <a href="https://cal.com/shereefelias/30min" target="_blank" rel="noopener noreferrer" aria-label="Book a call">
              <VideoIcon /> Book a Call
              </a>
            </div>
          </div>

          <div className="site-footer__location">
            <p>Locations</p>
            <span>New York, NY</span>
            <span>Westfield, NJ</span>
            <span>Greenville, SC</span>
            <span>Available for opportunities worldwide</span>
          </div>

          <p className="site-footer__copyright">
            &copy; {new Date().getFullYear()} Shereef Elias. All rights reserved.
          </p>
        </div>
      </footer>
      <ConsentBanner />
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
      { path: 'advisory', element: <Advisory /> },
      {
        path: 'infographics',
        element: (
          <Suspense fallback={<main className="page-main" aria-busy="true" />}>
            <Infographics />
          </Suspense>
        ),
      },
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
