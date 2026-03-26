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
        <ResponsivePicture
          :image="img"
          sizes="(min-width: 1024px) 800px, 100vw"
          picture-class="block-galerie_picture"
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
import type { ResponsiveImage } from '~/types/image'

defineProps<{
  /** Images au format responsive (ou ancien format { url, alt } via rétrocompat) */
  images?: (ResponsiveImage | { url: string; alt?: string })[]
  caption?: string
}>()
</script>

<style lang="scss">
.block-galerie {
  overflow: hidden;
  width: var(--100);
  margin: var(--20) 0;

  .block-galerie_swiper {
    width: 100%;
    height: 38vw;

    .swiper-button-prev,
    .swiper-button-next {
      color: var(--blue);
    }

    .swiper-pagination-bullet-active {
      background: var(--blue);
    }
  }

  .block-galerie_item {
    width: var(--100);
    flex: none;
    display: flex;
    flex-direction: column;
  }

  .block-galerie_picture {
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
  }

  .block-galerie_caption {
    margin-top: var(--10);
    color: #666;
    font-size: 14px;
    font-style: italic;
  }
}
</style>
