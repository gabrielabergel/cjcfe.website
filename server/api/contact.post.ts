// Limiteur en mémoire (par IP) — suffisant pour un site à faible trafic
const submissions = new Map<string, number[]>()
const WINDOW_MS = 10 * 60 * 1000 // fenêtre de 10 min
const MAX_PER_WINDOW = 4 // 4 envois max / IP / 10 min
const MIN_FILL_MS = 2000 // formulaire rempli en < 2s => bot

export default defineEventHandler(async (event) => {
  const apiUrl = useRuntimeConfig(event).apiUrl

  if (!apiUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'API_URL is missing.',
    })
  }

  const body = await readBody(event)

  // 1) Honeypot : le champ "website" est caché ; s'il est rempli, c'est un bot.
  //    On répond "ok" sans rien envoyer pour ne pas éveiller les soupçons.
  if (body?.website) {
    return { status: 'ok' }
  }

  // 2) Time-trap : soumission quasi instantanée => bot (on ignore silencieusement).
  if (body?.ts && Date.now() - Number(body.ts) < MIN_FILL_MS) {
    return { status: 'ok' }
  }

  // 3) Rate limiting par IP
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const now = Date.now()
  const recent = (submissions.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Trop de tentatives. Merci de réessayer plus tard.',
    })
  }
  recent.push(now)
  submissions.set(ip, recent)

  try {
    const response = await $fetch(`${apiUrl}/api/contact/submit`, {
      method: 'POST',
      body: {
        name: body?.name,
        email: body?.email,
        phone: body?.phone,
        subject: body?.subject,
        message: body?.message,
        website: body?.website ?? '', // honeypot transmis au CMS (double sécurité)
      },
    })

    return response
  } catch (error: any) {
    console.error('Contact form submission failed:', error)

    if (error?.data?.status === 'error') {
      return error.data
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Une erreur est survenue lors de l'envoi.",
    })
  }
})
