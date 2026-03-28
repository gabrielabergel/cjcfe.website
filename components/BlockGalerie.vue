<template>
  <div v-if="images?.length" class="block-galerie">
    <Swiper
      :modules="[Navigation, Pagination]"
      :slides-per-view="1"
      :space-between="20"
      :navigation="true"
      :pagination="{ clickable: true }"
      class="block-galerie_swiper"
    >
      <SwiperSlide v-for="(img, index) in images" :key="index" class="block-galerie_item">
        <img
          :src="getImageUrl(img)"
          :alt="getImageAlt(img)"
          class="block-galerie_img"
        />
      </SwiperSlide>
    </Swiper>
    <figcaption v-if="caption" class="block-galerie_caption">{{ caption }}</figcaption>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import type { ResponsiveImage, CMS_ImageObject } from '~/types/image'
import { isResponsiveImage, isCMSImageObject } from '~/types/image'

const props = defineProps<{
  /** Images au format responsive, CMS_ImageObject ou ancien format { url, alt } */
  images?: (ResponsiveImage | CMS_ImageObject | { url: string; alt?: string })[]
  caption?: string
}>()

// Helper pour extraire l'URL de l'image quel que soit le format
const getImageUrl = (image: ResponsiveImage | CMS_ImageObject | { url: string; alt?: string }): string => {
  if (isResponsiveImage(image)) {
    return image.fallback?.src || ''
  }
  if (isCMSImageObject(image)) {
    return image.reg?.url || ''
  }
  if ('url' in image) {
    return image.url
  }
  return ''
}

const getImageAlt = (image: ResponsiveImage | CMS_ImageObject | { url: string; alt?: string }): string => {
  if ('alt' in image && image.alt) {
    return image.alt
  }
  return ''
}
</script>

<style lang="scss">
.block-galerie {
  overflow: hidden;
  width: 100%;
  margin: var(--20) 0;

  .block-galerie_swiper {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: var(--radius, 8px);
    overflow: hidden;

    .swiper-button-prev,
    .swiper-button-next {
      color: var(--white);
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }

    .swiper-pagination-bullet {
      background: var(--white);
      opacity: 0.6;
    }

    .swiper-pagination-bullet-active {
      background: var(--white);
      opacity: 1;
    }
  }

  .block-galerie_item {
    width: 100%;
    height: 100%;
    flex: none;
  }

  .block-galerie_img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .block-galerie_caption {
    margin-top: var(--10);
    color: #666;
    font-size: 14px;
    font-style: italic;
  }
}
</style>
