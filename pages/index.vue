<template>
  <main class="v-home">

    <HomeHero
      v-if="data?.result"
      :titre="data.result.home.titre"
      :soustitre="data.result.home.soustitre"
      :cover="data.result.home.cover"
    />

    <ArticleSlider v-if="lastArticles.length" title="Actualités" :articles="lastArticles" />

    <ListeEvenement
      v-if="formattedEvents.length"
      title="Événements"
      :events="formattedEvents"
    />

  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CMS_ImageObject } from '~/types/image'

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
  mainTitle: string | null
  resume: string | null
  cover: CMS_ImageObject | null
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
      cover: CMS_ImageObject | null
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
          cover: {
            query: 'page.content.get("cover").toFile',
            select: {
              alt: 'file.alt.value',
              tiny: 'file.resize(50, null, 10)',
              small: 'file.resize(500)',
              reg: 'file.resize(1280)',
              large: 'file.resize(1920)',
              xxl: 'file.resize(2500)',
              focus: 'file.focus',
            },
          },
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
          mainTitle: true,
          resume: true,
          cover: {
            query: 'page.content.get("image").toFile',
            select: {
              alt: 'file.alt.value',
              tiny: 'file.resize(50, null, 10)',
              small: 'file.resize(500)',
              reg: 'file.resize(1280)',
              large: 'file.resize(1920)',
              xxl: 'file.resize(2500)',
              focus: 'file.focus',
            },
          },
        },
      },
    },
  },
})

// Transformer les 3 derniers articles pour le ArticleSlider
const lastArticles = computed(() => {
  const articles = data.value?.result?.actualites ?? []
  return articles.map((article) => ({
    nom: article.mainTitle || article.title,
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
