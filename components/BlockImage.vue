<template>
  <figure v-if="hasValidImage" class="block-image">
    <div class="block-image_wrapper">
      <ResponsivePicture
        v-if="isResponsive"
        :image="image as ResponsiveImage"
        :sizes="sizes"
        :alt="alt"
        picture-class="block-image_picture"
      />
      <img
        v-else-if="imageUrl"
        :src="imageUrl"
        :alt="alt"
        class="block-image_img"
        :style="{ objectPosition: focusPoint }"
      />
    </div>
    <figcaption v-if="caption" class="block-image_caption">{{ caption }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
import type { ResponsiveImage, CMS_ImageObject } from '~/types/image'
import { isResponsiveImage, isCMSImageObject } from '~/types/image'

const props = defineProps<{
  image?: ResponsiveImage | CMS_ImageObject | { url: string; alt?: string } | null
  alt?: string
  caption?: string
  sizes?: string
}>()

const isResponsive = computed(() => {
  return props.image && isResponsiveImage(props.image)
})

const isCMSImage = computed(() => {
  return props.image && isCMSImageObject(props.image)
})

const imageUrl = computed(() => {
  if (!props.image) return ''
  // CMS_ImageObject format (new)
  if (isCMSImage.value) {
    const img = props.image as CMS_ImageObject
    return img.reg?.url || ''
  }
  // Simple { url: string } format
  if ('url' in props.image && typeof props.image.url === 'string') {
    return props.image.url
  }
  return ''
})

const hasValidImage = computed(() => {
  if (!props.image) return false
  if (isResponsive.value) return true
  if (isCMSImage.value) return true
  return imageUrl.value.length > 0
})

// Récupère le point focal pour object-position
const focusPoint = computed(() => {
  if (!props.image) return 'center'
  if (isCMSImage.value) {
    const img = props.image as CMS_ImageObject
    return img.focus || 'center'
  }
  return 'center'
})
</script>

<style lang="scss">
.block-image {
  margin: var(--20) 0;

  &_wrapper {
    width: 100%;
    aspect-ratio: 16 / 9; // Ratio fixe pour toutes les images
    border-radius: var(--radius, 8px);
    overflow: hidden;
  }

  &_picture {
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  &_img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &_caption {
    margin-top: var(--10);
    font-size: 14px;
    color: #666;
    font-style: italic;
  }
}
</style>
