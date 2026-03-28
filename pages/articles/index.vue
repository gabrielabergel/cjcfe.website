<template>
  <main class="page">
    <PageHero
      :titre="data?.result?.page?.titre"
      :soustitre="data?.result?.page?.soustitre"
      transparent
    />

    <!-- Article à la Une -->
    <section v-if="featuredArticle" class="featured">
      <div class="featured_title_wrapper">
        <h2 class="featured_title">Article à la Une</h2>
      </div>
      <NuxtLink :to="`/articles/${featuredArticle.slug}`" class="featured_content">
        <div v-if="featuredArticle.cover?.reg" class="featured_image">
          <img :src="featuredArticle.cover.reg.url" :alt="featuredArticle.cover.alt || featuredArticle.title" :style="{ objectPosition: featuredArticle.cover.focus || 'center' }" />
        </div>
        <div class="featured_info">
          <h3 class="featured_name">{{ featuredArticle.title }}</h3>
          <p v-if="featuredArticle.resume" class="featured_description">{{ featuredArticle.resume }}</p>
          <span class="featured_link">
            Lire
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </span>
        </div>
      </NuxtLink>
    </section>

    <!-- Liste des autres articles -->
    <section v-if="displayedArticles.length" class="articles">
      <div class="articles_list">
        <NuxtLink
          v-for="(article, index) in displayedArticles"
          :key="index"
          :to="`/articles/${article.slug}`"
          class="article_item"
        >
          <div v-if="article.cover?.reg" class="article_image">
            <img :src="article.cover.reg.url" :alt="article.cover.alt || article.title" :style="{ objectPosition: article.cover.focus || 'center' }" />
          </div>
          <div v-else class="article_placeholder" :class="index % 2 === 0 ? 'is-blue' : 'is-beige'">
            <span class="article_placeholder_title">{{ article.title }}</span>
          </div>
          <div class="article_content">
            <h3 class="article_title">{{ article.title }}</h3>
            <p v-if="article.resume" class="article_resume">{{ article.resume }}</p>
            <span class="article_link">
              Lire
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
          </div>
        </NuxtLink>
      </div>
      <div v-if="hasMoreArticles && !showAllArticles" class="articles_more">
        <button class="btn" @click="showAllArticles = true">Voir tous les articles</button>
      </div>
    </section>

    <!-- Liste des événements -->
    <ListeEvenement
      v-if="formattedEvents.length"
      title="Événements"
      :events="formattedEvents"
    />

    <!-- La gazette -->
    <section v-if="data?.result?.page?.gazette_titre" class="gazette">
      <div class="gazette_header">
        <div class="gazette_title">
          <h2>{{ data.result.page.gazette_titre }}</h2>
        </div>
        <div class="gazette_subtitle">
          <p v-if="data.result.page.gazette_soustitre">{{ data.result.page.gazette_soustitre }}</p>
          <a v-if="data.result.page.gazette_pdf?.url" :href="data.result.page.gazette_pdf.url" download target="_blank" class="btn">
            {{ data.result.page.gazette_bouton_texte || 'Télécharger la gazette' }}
          </a>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CMS_ImageObject } from '~/types/image'

type Event = {
  date: string | null
  heuredebut: string | null
  heurefin: string | null
  nom: string | null
  description: string | null
  lieu: string | null
}

type Article = {
  title: string
  slug: string
  resume: string | null
  cover: CMS_ImageObject | null
}

type FetchData = CMS_API_Response & {
  result: {
    page: {
      title: string
      slug: string
      titre: CMS_API_Block[]
      soustitre: CMS_API_Block[]
      evenements: Event[]
      children: Article[]
      // Gazette
      gazette_titre: string | null
      gazette_soustitre: string | null
      gazette_pdf: { url: string } | null
      gazette_bouton_texte: string | null
    }
  }
}

const { data } = await useFetch<FetchData>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  body: {
    query: 'site',
    select: {
      page: {
        query: "site.find('actualites')",
        select: {
          title: true,
          slug: true,
          titre: 'page.titre.toBlocks',
          soustitre: 'page.soustitre.toBlocks',
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
          children: {
            query: 'page.children.listed',
            select: {
              title: true,
              slug: true,
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
          // Gazette
          gazette_titre: true,
          gazette_soustitre: true,
          gazette_pdf: {
            query: 'page.gazette_pdf.toFile',
            select: {
              url: 'file.url',
            },
          },
          gazette_bouton_texte: true,
        },
      },
    },
  },
})

// Premier article (à la une)
const featuredArticle = computed(() => {
  const children = data.value?.result?.page?.children
  if (!children || children.length === 0) return null
  return children[0]
})

// Autres articles (sans le premier)
const otherArticles = computed(() => {
  const children = data.value?.result?.page?.children
  if (!children || children.length <= 1) return []
  return children.slice(1)
})

// État pour afficher tous les articles
const showAllArticles = ref(false)

// Articles affichés (limité à 4, ou tous si showAllArticles est true)
const displayedArticles = computed(() => {
  if (showAllArticles.value) {
    return otherArticles.value
  }
  return otherArticles.value.slice(0, 4)
})

// Vérifier s'il y a plus de 5 articles au total
const hasMoreArticles = computed(() => {
  const children = data.value?.result?.page?.children
  return children && children.length > 5
})

// Formater les événements pour ListeAgenda
const formattedEvents = computed(() => {
  const events = data.value?.result?.page?.evenements
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

<style lang="scss" scoped>
.page {
  padding-top: 80px;
}

.articles {
  padding: 0;
  background-color: transparent;
}

.articles_list {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
}

.articles_more {
  display: flex;
  justify-content: center;
  margin-top: var(--40);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background-color: var(--blue);
  color: var(--white);
  text-decoration: none;
  border-radius: 100px;
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 500;
  border: 2px solid var(--blue);
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background-color: var(--beige);
    border-color: var(--beige);
    color: var(--black);
  }
}

.article_item {
  background-color: var(--white);
  overflow: hidden;
  text-decoration: none;
  flex: 1 1 25%;
  min-width: 25%;
  max-width: 50%;
  border: solid var(--blue);
  border-width: 1px 0.5px;

  &:hover {
    .article_link {
      gap: 12px;
    }
  }
}

.article_image {
  width: 100%;
  height: 200px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.article_placeholder {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--20);

  &.is-blue {
    background-color: var(--blue);
  }

  &.is-beige {
    background-color: var(--beige);
  }
}

.article_placeholder_title {
  color: var(--white);
  font-family: var(--font-title);
  font-size: clamp(20px, 3vw, 28px);
  text-transform: uppercase;
  text-align: center;
  line-height: 1.2;
}

.article_content {
  padding: var(--20);
}

.article_title {
  margin: 0 0 10px 0;
  color: var(--blue);
  font-family: 'Inter', var(--font-body);
  font-size: 20px;
  font-weight: 600;
}

.article_resume {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article_link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--blue);
  font-size: 14px;
  font-weight: 500;
  transition: gap 0.3s;

  svg {
    flex-shrink: 0;
  }
}

// Article à la Une
.featured {
  width: 100%;
  min-height: 30vw;
  background-color: var(--blue);
  display: flex;
}

.featured_title_wrapper {
  padding: var(--40);
  width: 40%;
  display: flex;
  align-items: flex-start;
}

.featured_title {
  color: var(--white);
  font-family: var(--font-title);
  font-size: clamp(32px, 5vw, 72px);
  text-transform: uppercase;
  margin: 0;
}

.featured_content {
  width: 60%;
  display: flex;
  flex-direction: column;
  text-decoration: none;
}

.featured_image {
  width: 100%;
  height: 20vw;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.featured_info {
  padding: var(--40) var(--20);
  background-color: var(--beige);
  flex: 1;
}

.featured_name {
  color: var(--white);
  font-family: var(--font-body);
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 10px 0;
}

.featured_description {
  color: var(--white);
  font-family: var(--font-body);
  font-size: 14px;
  margin: 0 0 15px 0;
  line-height: 1.5;
}

.featured_link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--white);
  font-size: 14px;
  font-weight: 500;
  transition: gap 0.3s;

  svg {
    flex-shrink: 0;
  }
}

.featured_content:hover .featured_link {
  gap: 12px;
}

@media screen and (max-width: 991px) {
  .featured {
    flex-direction: column;
    min-height: auto;
  }

  .featured_title_wrapper {
    width: 100%;
    padding: var(--20);
  }

  .featured_content {
    width: 100%;
  }

  .featured_image {
    height: 40vw;
  }

  .article_item {
    flex: 1 1 50%;
    min-width: 50%;
    max-width: 100%;
  }
}

@media screen and (max-width: 479px) {
  .featured_title_wrapper {
    padding: var(--10);
  }

  .featured_title {
    font-size: 45px;
  }

  .featured_info {
    padding: var(--20) 20px;
  }

  .article_item {
    flex: 1 1 100%;
    min-width: 100%;
    max-width: 100%;
  }
}

// Gazette
.gazette {
  background-color: var(--beige);
}

.gazette_header {
  padding: var(--40);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
}

.gazette_title {
  flex: 1;

  h2 {
    color: var(--white);
    font-size: 80px;
    margin: 0;
    line-height: 1.1;
  }
}

.gazette_subtitle {
  flex: 1;

  p {
    color: var(--white);
    font-size: 18px;
    line-height: 1.5;
    margin: 0 0 var(--20);
  }

  .btn {
    background-color: var(--white);
    color: var(--beige);
    border: none;

    &:hover {
      background-color: var(--blue);
      color: var(--white);
      opacity: 1;
    }
  }
}

@media screen and (max-width: 991px) {
  .gazette_title {
    h2 {
      font-size: 60px;
    }
  }

  .gazette_subtitle {
    p {
      font-size: 16px;
    }
  }
}

@media screen and (max-width: 767px) {
  .gazette_header {
    flex-direction: column;
    gap: 20px;
    padding: 30px;
  }

  .gazette_title {
    h2 {
      font-size: 48px;
    }
  }
}

@media screen and (max-width: 479px) {
  .gazette_header {
    padding: 20px;
  }

  .gazette_title {
    h2 {
      font-size: 45px;
    }
  }

  .gazette_subtitle {
    p {
      font-size: 14px;
    }
  }
}
</style>
