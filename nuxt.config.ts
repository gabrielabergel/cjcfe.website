// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Special+Gothic+Condensed+One&display=swap' },
      ],
    },
  },
  devServer: {
    port: 3002,
    https: false,
  },
  ssr: false,
  css: [
    '~/assets/scss/main.scss'
  ],
  runtimeConfig: {
    // Côté serveur seulement (pas exposé au client)
    apiUrl: process.env.API_URL || 'http://localhost:8888',
    apiAuthEmail: process.env.API_AUTH_EMAIL || '',
    apiAuthPassword: process.env.API_AUTH_PASSWORD || '',
    // Côté client (public)
    public: {
      // URL de base du CMS, utilisée pour normaliser les URLs des médias
      cmsBaseUrl: process.env.API_URL || 'http://localhost:8888',
    },
  },
})
