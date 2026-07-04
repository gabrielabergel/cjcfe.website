// Sitemap du site (front). Les URLs pointent vers le domaine du site.
// Les pages « Mentions légales » et « Protection des données » sont volontairement
// exclues (non indexées). Les articles sont récupérés dynamiquement depuis le CMS.
export default defineEventHandler(async (event) => {
  const origin = getRequestURL(event).origin

  // Pages statiques du front (les 2 pages légales sont exclues à dessein)
  const staticPaths = [
    '/',
    '/articles',
    '/qui-sommes-nous',
    '/notre-histoire',
    '/infos-pratiques',
    '/contact',
  ]

  // Articles (dynamiques) depuis le CMS
  let articlePaths: string[] = []
  try {
    const res = await $fetch<{ result?: { articles?: Array<{ slug?: string }> } }>(
      '/api/CMS_KQLRequest',
      {
        method: 'POST',
        body: {
          query: "site.find('actualites')",
          select: { articles: { query: 'page.children.listed', select: { slug: true } } },
        },
      }
    )
    articlePaths = (res?.result?.articles ?? [])
      .map((a) => a?.slug)
      .filter((slug): slug is string => !!slug)
      .map((slug) => `/articles/${slug}`)
  } catch {
    // En cas d'erreur CMS, on renvoie au moins les pages statiques
  }

  const urls = [...staticPaths, ...articlePaths]
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((path) => `  <url>\n    <loc>${origin}${path}</loc>\n  </url>`),
    '</urlset>',
    '',
  ].join('\n')

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return body
})
