<template>
  <main class="v-home">

    <HomeHero
      v-if="data?.result"
      :titre="data.result.home.titre"
      :soustitre="data.result.home.soustitre"
      :cover="data.result.home.cover"
    />

    <PortraitSlider v-if="lastArticles.length" title="Actualités" :portraits="lastArticles" />

    <ListeEvenement
      v-if="formattedEvents.length"
      title="Événements"
      :events="formattedEvents"
    />

  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ResponsiveImage } from '~/types/image'

// TYPES
type ReferenceEvent = {
  date: string | null
  heuredebut: string | null
  heurefin: string | null
  nom: string | null
  description: string | null
  lieu: string | null
}

type Article = {
  title: string | null
  main_title: string | null
  resume: string | null
  cover: { url: string } | null
  slug: string | null
}

// FETCH DONNEES HOME
type HomePageData = CMS_API_Response & {
  result: {
    home: {
      title: string
      slug: string
      bandeau: string | null
      titre: CMS_API_Block[]
      soustitre: CMS_API_Block[]
      cover: ResponsiveImage | null
    }
    evenementsData: {
      evenements: ReferenceEvent[]
    }
    actualites: Article[]
  }
}

// Fetch des données de la page home + événements + portraits
const { data } = await useFetch<HomePageData>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  getCachedData: () => undefined,
  body: {
    query: 'site',
    select: {
      home: {
        query: "site.find('home')",
        select: {
          title: true,
          slug: true,
          bandeau: true,
          titre: 'page.titre.toBlocks',
          soustitre: 'page.soustitre.toBlocks',
          cover: 'page.responsiveImage("cover", "cover")',
        },
      },
      evenementsData: {
        query: "site.find('actualites')",
        select: {
          evenements: {
            query: 'page.evenements.toStructure',
            select: {
              date: true,
              heuredebut: true,
              heurefin: true,
              nom: true,
              description: true,
              lieu: true,
            },
          },
        },
      },
      actualites: {
        query: "site.find('actualites').children.listed.sortBy('date', 'desc').limit(6)",
        select: {
          title: true,
          slug: true,
          main_title: true,
          resume: true,
          cover: {
            query: 'page.cover.toFile',
            select: {
              url: 'file.devUrl',
            },
          },
        },
      },
    },
  },
})

// Transformer les 3 derniers articles pour le PortraitSlider
const lastArticles = computed(() => {
  const articles = data.value?.result?.actualites ?? []
  return articles.map((article) => ({
    nom: article.main_title || article.title,
    description: article.resume,
    image: article.cover,
    slug: article.slug,
  }))
})

// Transformer les événements du CMS pour le composant ListeEvenement
const formattedEvents = computed(() => {
  const events = data.value?.result?.evenementsData?.evenements
  if (!events) return []

  return events.map((event) => {
    let dateStr = ''
    if (event.date) {
      const dateObj = new Date(event.date)
      dateStr = dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    }
    if (event.heuredebut) {
      dateStr += ` - ${event.heuredebut}`
    }
    if (event.heurefin) {
      dateStr += ` à ${event.heurefin}`
    }

    return {
      date: dateStr,
      title: event.nom || '',
      venue: event.lieu || '',
      description: event.description || ''
    }
  })
})
</script>
