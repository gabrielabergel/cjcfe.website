// Proxy de téléchargement : récupère un fichier média du CMS et le renvoie
// en pièce jointe (Content-Disposition: attachment) pour forcer le téléchargement.
// Un lien direct vers le CMS (autre domaine) ne téléchargerait pas le fichier :
// l'attribut `download` est ignoré en cross-origin et le PDF s'ouvrirait dans l'onglet.
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const fileUrl = String(query.url ?? '')
  // Nom de fichier nettoyé pour l'en-tête HTTP (évite l'injection d'en-tête)
  const filename = String(query.name ?? 'document').replace(/[^\w.\-]+/g, '_') || 'document'

  const config = useRuntimeConfig()
  const cmsBase = String(config.apiUrl || config.public.cmsBaseUrl || '').replace(/\/+$/, '')

  // Sécurité (anti-SSRF) : n'autoriser que les médias du CMS configuré
  if (!cmsBase || !fileUrl.startsWith(`${cmsBase}/media/`)) {
    throw createError({ statusCode: 400, statusMessage: 'URL non autorisée' })
  }

  const upstream = await fetch(fileUrl)
  const contentType = upstream.headers.get('content-type') || ''
  // text/html => le CMS a redirigé (média non servi) plutôt que renvoyé le fichier
  if (!upstream.ok || contentType.includes('text/html')) {
    throw createError({ statusCode: 502, statusMessage: 'Fichier indisponible' })
  }

  setHeader(event, 'Content-Type', contentType || 'application/octet-stream')
  setHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`)
  return Buffer.from(await upstream.arrayBuffer())
})
