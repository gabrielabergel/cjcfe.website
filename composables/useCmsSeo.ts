import { toValue, type MaybeRefOrGetter } from 'vue'

// Structure renvoyée par la méthode KQL `page.seo` du plugin cjcfe-seo
export interface CmsSeo {
  title?: string
  description?: string
  canonical?: string
  robots?: string
  og?: {
    title?: string
    description?: string
    image?: string
    url?: string
    siteName?: string
    type?: string
  }
}

/**
 * Récupère le SEO d'une page depuis le CMS (via `page.seo`) et l'applique
 * (title, description, robots, Open Graph, Twitter Card, canonical).
 *
 * @param pageQuery requête KQL de la page, ex. "site.find('home')".
 *   Peut être un getter réactif (utile pour les pages à slug dynamique).
 *
 * Les URLs canonical / og:url pointent vers le site (front), pas vers le CMS.
 */
export function useCmsSeo(pageQuery: MaybeRefOrGetter<string>) {
  const route = useRoute()
  const reqUrl = useRequestURL()

  const { data } = useFetch<{ result?: { seo?: CmsSeo } }>('/api/CMS_KQLRequest', {
    method: 'POST',
    body: computed(() => ({
      query: toValue(pageQuery),
      select: { seo: 'page.seo' },
    })),
    watch: [() => toValue(pageQuery)],
  })

  const seo = computed(() => data.value?.result?.seo)
  // Canonical/og:url = URL du site (origine du front + chemin courant), jamais le CMS
  const canonical = computed(() => `${reqUrl.origin}${route.path}`)

  useSeoMeta({
    title: () => seo.value?.title || null,
    description: () => seo.value?.description || null,
    robots: () => seo.value?.robots || null,
    ogType: () => (seo.value?.og?.type as 'website') || 'website',
    ogTitle: () => seo.value?.og?.title || seo.value?.title || null,
    ogDescription: () => seo.value?.og?.description || seo.value?.description || null,
    ogImage: () => seo.value?.og?.image || null,
    ogSiteName: () => seo.value?.og?.siteName || null,
    ogUrl: () => canonical.value,
    ogLocale: 'fr_FR',
    twitterCard: 'summary_large_image',
    twitterTitle: () => seo.value?.og?.title || seo.value?.title || null,
    twitterDescription: () => seo.value?.og?.description || seo.value?.description || null,
    twitterImage: () => seo.value?.og?.image || null,
  })

  useHead({
    link: [{ rel: 'canonical', href: () => canonical.value }],
  })

  return { seo }
}
