// Matomo (hébergé sur matomo.cjcfe.fr)
// Mode sans cookies : pas besoin de bandeau de consentement.
// Suit la première page + chaque navigation interne (site Nuxt = SPA côté client).

const MATOMO_URL = 'https://matomo.cjcfe.fr/'
const MATOMO_SITE_ID = '1'

declare global {
  interface Window {
    _paq: unknown[][]
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  // Pas de stats en développement local
  if (import.meta.dev) return

  const _paq = (window._paq = window._paq || [])
  _paq.push(['disableCookies'])
  _paq.push(['enableLinkTracking'])
  _paq.push(['setTrackerUrl', MATOMO_URL + 'matomo.php'])
  _paq.push(['setSiteId', MATOMO_SITE_ID])

  const script = document.createElement('script')
  script.async = true
  script.src = MATOMO_URL + 'matomo.js'
  document.head.appendChild(script)

  let lastUrl: string | null = null

  const trackPage = () => {
    // Laisse le temps à useHead de mettre à jour le <title>
    setTimeout(() => {
      const url = window.location.href
      if (url === lastUrl) return
      if (lastUrl) _paq.push(['setReferrerUrl', lastUrl])
      _paq.push(['setCustomUrl', url])
      _paq.push(['setDocumentTitle', document.title])
      _paq.push(['trackPageView'])
      lastUrl = url
    }, 50)
  }

  nuxtApp.hook('app:mounted', trackPage)
  nuxtApp.hook('page:finish', trackPage)
})
