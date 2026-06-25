import { useEffect, useState } from 'react'

// GDPR / ePrivacy consent gate for analytics. Umami (pageviews) and its session
// recorder are NOT loaded until the visitor explicitly accepts. The choice is
// remembered in localStorage so the banner only shows once.
const CONSENT_KEY = 'analytics-consent'
const UMAMI_HOST = 'https://insights.westfieldnexus.com'
const WEBSITE_ID = '38dbf446-625f-4dd9-b5bd-8d0b3f33a3ec'

function loadAnalytics() {
  if (document.getElementById('umami-script')) return // already loaded

  const script = document.createElement('script')
  script.id = 'umami-script'
  script.defer = true
  script.src = `${UMAMI_HOST}/script.js`
  script.setAttribute('data-website-id', WEBSITE_ID)
  document.head.appendChild(script)

  const recorder = document.createElement('script')
  recorder.id = 'umami-recorder'
  recorder.defer = true
  recorder.src = `${UMAMI_HOST}/recorder.js`
  recorder.setAttribute('data-website-id', WEBSITE_ID)
  recorder.setAttribute('data-sample-rate', '0.15')
  recorder.setAttribute('data-mask-level', 'moderate')
  recorder.setAttribute('data-max-duration', '300000')
  document.head.appendChild(recorder)
}

function readConsent(): string | null {
  try {
    return localStorage.getItem(CONSENT_KEY)
  } catch {
    return null
  }
}

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = readConsent()
    if (stored === 'granted') {
      loadAnalytics()
    } else if (stored !== 'denied') {
      setVisible(true)
    }
  }, [])

  function choose(granted: boolean) {
    try {
      localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied')
    } catch {
      /* storage unavailable — honor the choice for this session only */
    }
    if (granted) loadAnalytics()
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="consent-banner" role="dialog" aria-label="Privacy consent" aria-live="polite">
      <p className="consent-banner__text">
        This site uses privacy-friendly, self-hosted analytics and anonymous session
        insights (<a href="https://umami.is/" target="_blank" rel="noopener noreferrer">Umami</a>)
        to understand usage and improve the experience — no ads, no cross-site tracking.
      </p>
      <div className="consent-banner__actions">
        <button type="button" className="consent-btn consent-btn--ghost" onClick={() => choose(false)}>
          Decline
        </button>
        <button type="button" className="consent-btn consent-btn--solid" onClick={() => choose(true)}>
          Accept
        </button>
      </div>
    </div>
  )
}
