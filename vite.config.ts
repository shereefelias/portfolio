import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { SITE_URL, routeMeta, redirects } from './src/seo'

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Apply a route's SEO metadata to a built index.html string by swapping the
// content of the title / description / canonical / Open Graph / Twitter tags
// that index.html ships with (see index.html <head>).
function applyMeta(html: string, path: string, title: string, description: string): string {
  const url = `${SITE_URL}${path === '/' ? '/' : path}`
  const t = escapeHtml(title)
  const d = escapeHtml(description)
  const metaName = (name: string) =>
    new RegExp(`(<meta name="${name}" content=")[^"]*(")`)
  const metaProp = (prop: string) =>
    new RegExp(`(<meta property="${prop}" content=")[^"]*(")`)
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(metaName('description'), `$1${d}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(metaProp('og:title'), `$1${t}$2`)
    .replace(metaProp('og:description'), `$1${d}$2`)
    .replace(metaProp('og:url'), `$1${url}$2`)
}

// Content-Security-Policy applied to built HTML only (not the dev server, whose
// HMR relies on inline/eval scripts). Allows: same-origin assets, the self-hosted
// Umami analytics host (script + beacon), inline styles (React style props +
// Tailwind), and data: URIs for icons. JSON-LD is a non-executable data block.
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "script-src 'self' https://insights.westfieldnexus.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self' https://insights.westfieldnexus.com",
  "manifest-src 'self'",
  "form-action 'self'",
].join('; ')

function injectCsp(html: string): string {
  if (html.includes('http-equiv="Content-Security-Policy"')) return html
  return html.replace(
    '<meta charset="UTF-8" />',
    `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
  )
}

function redirectStub(to: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Redirecting…</title>
    <link rel="canonical" href="${SITE_URL}${to}" />
    <meta name="robots" content="noindex" />
    <meta http-equiv="refresh" content="0; url=${to}" />
    <script>location.replace(${JSON.stringify(to)})</script>
  </head>
  <body>Redirecting to <a href="${to}">${to}</a>…</body>
</html>
`
}

function buildSitemap(): string {
  const lastmod = new Date().toISOString().slice(0, 10)
  const urls = Object.entries(routeMeta)
    .map(([path, m]) => {
      const loc = `${SITE_URL}${path === '/' ? '/' : path}`
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${m.priority.toFixed(1)}</priority>\n  </url>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

// GitHub Pages serves only static files and has no SPA rewrite or server-side
// redirects. This plugin makes the static SPA SEO-friendly at build time:
//   - writes dist/<route>/index.html for every route (real 200 responses) with
//     that route's unique title/description/canonical/OG tags;
//   - writes redirect stubs for legacy paths (e.g. /viz -> /infographics);
//   - copies the home shell to 404.html (fallback for unknown paths);
//   - regenerates sitemap.xml from the same route metadata.
function seoPrerender(): Plugin {
  let outDir = 'dist'
  return {
    name: 'seo-prerender',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const indexPath = resolve(outDir, 'index.html')
      const base = injectCsp(readFileSync(indexPath, 'utf-8'))

      for (const [path, meta] of Object.entries(routeMeta)) {
        const html = applyMeta(base, path, meta.title, meta.description)
        const file = path === '/' ? indexPath : resolve(outDir, `.${path}/index.html`)
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, html)
      }

      for (const [from, to] of Object.entries(redirects)) {
        const file = resolve(outDir, `.${from}/index.html`)
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, redirectStub(to))
      }

      // 404 fallback for unknown paths (served by Pages with a 404 status).
      writeFileSync(resolve(outDir, '404.html'), readFileSync(indexPath, 'utf-8'))

      writeFileSync(resolve(outDir, 'sitemap.xml'), buildSitemap())
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    tailwindcss(),
    react(),
    seoPrerender(),
  ],
})
