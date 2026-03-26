<template>
  <div v-show="portraits.length" class="portrait">
    <div class="portrait_title_wrapper">
      <h2 class="portrait_title">{{ title }}</h2>
    </div>
    <div class="portrait_slider">
      <Swiper
        :modules="[Autoplay, Navigation]"
        :slides-per-view="3"
        :space-between="0"
        :navigation="true"
        :autoplay="{
          delay: 5000,
          disableOnInteraction: true,
        }"
        :loop="portraits.length > 3"
        class="portrait_swiper"
      >
        <SwiperSlide
          v-for="(portrait, index) in portraits"
          :key="index"
          class="portrait_slide"
        >
          <NuxtLink
            v-if="portrait.slug"
            :to="`/articles/${portrait.slug}`"
            class="portrait_card_link"
          >
            <!-- Image portrait -->
            <div v-if="getImageUrl(portrait.image)" class="portrait_card_picture">
              <img :src="getImageUrl(portrait.image)" :alt="portrait.nom || ''" />
            </div>
            <!-- Placeholder si pas d'image -->
            <div v-else class="portrait_card_placeholder">
              <span class="portrait_card_placeholder_title">{{ portrait.nom }}</span>
            </div>
            <div class="portrait_card_info">
              <p class="portrait_name">{{ portrait.nom }}</p>
              <p class="portrait_description">{{ portrait.description }}</p>
            </div>
          </NuxtLink>
          <div v-else class="portrait_card_link">
            <!-- Image portrait -->
            <div v-if="getImageUrl(portrait.image)" class="portrait_card_picture">
              <img :src="getImageUrl(portrait.image)" :alt="portrait.nom || ''" />
            </div>
            <!-- Placeholder si pas d'image -->
            <div v-else class="portrait_card_placeholder">
              <span class="portrait_card_placeholder_title">{{ portrait.nom }}</span>
            </div>
            <div class="portrait_card_info">
              <p class="portrait_name">{{ portrait.nom }}</p>
              <p class="portrait_description">{{ portrait.description }}</p>
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
import type { ResponsiveImage } from '~/types/image'
import 'swiper/css'
import 'swiper/css/navigation'

interface Portrait {
  nom: string | null
  description: string | null
  image: ResponsiveImage | { url: string } | null
  slug?: string | null
}

defineProps<{
  title?: string
  portraits: Portrait[]
}>()

// Helper pour extraire l'URL de l'image quel que soit le format
const getImageUrl = (image: ResponsiveImage | { url: string } | null): string => {
  if (!image) return ''
  // Si c'est un format simple { url: string }
  if ('url' in image && typeof image.url === 'string') {
    return image.url
  }
  // Si c'est un ResponsiveImage avec fallback
  if ('fallback' in image && image.fallback?.src) {
    return image.fallback.src
  }
  return ''
}
</script>

<style lang="scss">
// Portrait Slider Component Styles
.portrait {
  width: var(--100);
  min-height: 30vw;
  background-color: var(--blue);
  display: flex;
}

.portrait_slider {
  width: 60%;
  position: relative;
}

.portrait_swiper {
  width: 100%;
  height: 100%;

  .swiper-button-prev,
  .swiper-button-next {
    color: var(--white);
  }
}

.portrait_slide {
  display: flex;
  flex-direction: column;
}

.portrait_card_link {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  width: 100%;
  height: 100%;
}

// Le <picture> prend la place de l'ancienne <img>
.portrait_card_picture {
  width: var(--100);
  height: 20vw;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.portrait_card_placeholder {
  width: var(--100);
  height: 20vw;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--20);
  background-color: #e5e5e5;
}

.portrait_card_placeholder_title {
  font-family: var(--font-title);
  font-size: clamp(32px, 5vw, 64px);
  text-transform: uppercase;
  text-align: center;
  line-height: 1.1;
  color: var(--blue);
}

.portrait_card_info {
  padding: var(--40) var(--10) var(--20);
  background-color: var(--beige);
  height: 100%;
}

.portrait_slide:nth-child(even) .portrait_card_info {
  background-color: var(--blue);
}

.portrait_title_wrapper {
  padding-top: var(--40);
  padding-right: var(--40);
  padding-left: var(--40);
  width: 40%;
}

.portrait_title {
  color: var(--white);
}

.portrait_name {
  color: var(--white);
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 400;
}

.portrait_description {
  color: var(--white);
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 16px;
}

// Media queries
@media screen and (max-width: 991px) {
  .portrait {
    flex-flow: column;
    min-height: 50vw;
  }

  .portrait_card_picture {
    height: 33.33vw;
  }

  .portrait_title_wrapper {
    width: var(--100);
  }

  .portrait_slider {
    width: 100%;
  }
}

@media screen and (max-width: 479px) {
  .portrait_title_wrapper {
    padding-right: var(--10);
    padding-left: var(--10);
  }
}
</style>
