// robots.txt du site (front). Autorise le crawl et référence le sitemap.
// On ne bloque PAS les pages légales ici : elles portent une balise meta
// robots=noindex (via le CMS), ce qui laisse Google les explorer pour voir
// le noindex — plus fiable qu'un Disallow qui empêcherait de le lire.
export default defineEventHandler((event) => {
  const origin = getRequestURL(event).origin
  const body = [
    'User-agent: *',
    'Allow: /',
    `Sitemap: ${origin}/sitemap.xml`,
    '',
  ].join('\n')

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return body
})
