<template>
  <figure v-if="hasValidImage" class="block-image">
    <ResponsivePicture
      v-if="isResponsive"
      :image="image"
      :sizes="sizes"
      :alt="alt"
      picture-class="block-image_picture"
    />
    <img
      v-else-if="imageUrl"
      :src="imageUrl"
      :alt="alt"
      class="block-image_img"
    />
    <figcaption v-if="caption" class="block-image_caption">{{ caption }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
import type { ResponsiveImage } from '~/types/image'
import { isResponsiveImage } from '~/types/image'

const props = defineProps<{
  image?: ResponsiveImage | { url: string; alt?: string } | null
  alt?: string
  caption?: string
  sizes?: string
}>()

const isResponsive = computed(() => {
  return props.image && isResponsiveImage(props.image)
})

const imageUrl = computed(() => {
  if (!props.image) return ''
  if ('url' in props.image && typeof props.image.url === 'string') {
    return props.image.url
  }
  return ''
})

const hasValidImage = computed(() => {
  if (!props.image) return false
  if (isResponsive.value) return true
  return imageUrl.value.length > 0
})
</script>

<style lang="scss">
.block-image {
  margin: var(--20) 0;

  &_picture {
    width: 100%;
    border-radius: var(--radius, 8px);
    overflow: hidden;

    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }

  &_img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: var(--radius, 8px);
  }

  &_caption {
    margin-top: var(--10);
    font-size: 14px;
    color: #666;
    font-style: italic;
  }
}
</style>
