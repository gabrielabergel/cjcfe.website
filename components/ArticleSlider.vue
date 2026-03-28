
<template>
  <div v-show="articles.length" class="article">
    <div class="article_title_wrapper">
      <h2 class="article_title">{{ title }}</h2>
    </div>
    <div class="article_slider">
      <Swiper
        :modules="[Autoplay, Navigation]"
        :slides-per-view="1"
        :space-between="0"
        :navigation="true"
        :autoplay="{
          delay: 5000,
          disableOnInteraction: true,
        }"
        :loop="articles.length > 1"
        :breakpoints="{
          768: {
            slidesPerView: 2,
          },
        }"
        class="article_swiper"
      >
        <SwiperSlide
          v-for="(article, index) in articles"
          :key="index"
          class="article_slide"
        >
          <NuxtLink
            v-if="article.slug"
            :to="`/articles/${article.slug}`"
            class="article_card_link"
          >
            <!-- Image article -->
            <div v-if="getImageUrl(article.image)" class="article_card_picture">
              <img :src="getImageUrl(article.image)" :alt="article.nom || ''" :style="{ objectPosition: article.image?.focus || 'center' }" />
            </div>
            <!-- Placeholder si pas d'image -->
            <div v-else class="article_card_placeholder">
              <span class="article_card_placeholder_title">{{ article.nom }}</span>
            </div>
            <div class="article_card_info" :class="{ 'is-blue': index % 2 === 1 }">
              <h3 class="article_name">{{ article.nom }}</h3>
              <p v-if="article.description" class="article_description">{{ article.description }}</p>
              <span class="article_link">
                Lire
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </span>
            </div>
          </NuxtLink>
          <div v-else class="article_card_link">
            <!-- Image article -->
            <div v-if="getImageUrl(article.image)" class="article_card_picture">
              <img :src="getImageUrl(article.image)" :alt="article.nom || ''" :style="{ objectPosition: article.image?.focus || 'center' }" />
            </div>
            <!-- Placeholder si pas d'image -->
            <div v-else class="article_card_placeholder">
              <span class="article_card_placeholder_title">{{ article.nom }}</span>
            </div>
            <div class="article_card_info" :class="{ 'is-blue': index % 2 === 1 }">
              <h3 class="article_name">{{ article.nom }}</h3>
              <p v-if="article.description" class="article_description">{{ article.description }}</p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation } from 'swiper/modules'
import type { CMS_ImageObject } from '~/types/image'
import 'swiper/css'
import 'swiper/css/navigation'

interface Article {
  nom: string | null
  description: string | null
  image: CMS_ImageObject | null
  slug?: string | null
}

defineProps<{
  title?: string
  articles: Article[]
}>()

// Helper pour extraire l'URL de l'image (utilise la variante reg par défaut)
const getImageUrl = (image: CMS_ImageObject | null): string => {
  if (!image) return ''
  // Retourne la variante reg (1280px) par défaut
  return image.reg?.url || ''
}
</script>

<style lang="scss">
// Article Slider Component Styles
.article {
  width: var(--100);
  min-height: 30vw;
  background-color: var(--blue);
  display: flex;
}

.article_slider {
  width: 60%;
  position: relative;
}

.article_swiper {
  width: 100%;
  height: 100%;

  .swiper-button-prev,
  .swiper-button-next {
    color: var(--white);
  }
}

.article_slide {
  display: flex;
  flex-direction: column;
}

.article_card_link {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  width: 100%;
  height: 100%;
}

// Le <picture> prend la place de l'ancienne <img>
.article_card_picture {
  width: var(--100);
  height: 20vw;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.article_card_placeholder {
  width: var(--100);
  height: 20vw;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--20);
  background-color: #e5e5e5;
}

.article_card_placeholder_title {
  font-family: var(--font-title);
  font-size: clamp(32px, 5vw, 64px);
  text-transform: uppercase;
  text-align: center;
  line-height: 1.1;
  color: var(--blue);
}

.article_card_info {
  padding: var(--20);
  background-color: var(--beige);
  height: 100%;

  &.is-blue {
    background-color: var(--blue);
  }
}

.article_title_wrapper {
  padding-top: var(--40);
  padding-right: var(--40);
  padding-left: var(--40);
  width: 40%;
}

.article_title {
  color: var(--white);
}

.article_name {
  margin: 0 0 10px 0;
  color: var(--white);
  font-family: 'Inter', var(--font-body);
  font-size: 20px;
  font-weight: 600;
}

.article_description {
  margin: 0 0 15px 0;
  color: var(--white);
  font-family: var(--font-body);
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
  color: var(--white);
  font-size: 14px;
  font-weight: 500;
  transition: gap 0.3s;

  svg {
    flex-shrink: 0;
  }
}

.article_card_link:hover .article_link {
  gap: 12px;
}

// Media queries
@media screen and (max-width: 991px) {
  .article {
    flex-flow: column;
    min-height: 50vw;
  }

  .article_card_picture {
    height: 33.33vw;
  }

  .article_title_wrapper {
    width: var(--100);
  }

  .article_slider {
    width: 100%;
  }
}

@media screen and (max-width: 479px) {
  .article_title_wrapper {
    padding-right: 20px;
    padding-left: 20px;
  }

  .article_title {
    font-size: 45px;
  }

  .article_card_picture,
  .article_card_placeholder {
    height: 50vw;
  }

  .article_swiper {
    .swiper-button-prev,
    .swiper-button-next {
      width: 30px;
      height: 30px;

      &::after {
        font-size: 16px;
      }
    }
  }
}
</style>
