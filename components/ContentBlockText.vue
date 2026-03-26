<template>
  <div class="block-text" :class="{ 'is-auto': isAuto }">
    <template v-for="(block, index) in blocks" :key="block.id ?? index">
      <!-- Block Titre (Heading) -->
      <BlockTitre
        v-if="block.type === 'heading'"
        :text="block.content?.text"
        :level="block.content?.level"
      />

      <!-- Block Texte -->
      <BlockTexte
        v-else-if="block.type === 'text'"
        :text="block.content?.text"
      />

      <!-- Block Image -->
      <BlockImage
        v-else-if="block.type === 'image' && hasImage(block)"
        :image="block.content?.image"
        :alt="block.content?.alt"
        :caption="block.content?.caption"
        sizes="(min-width: 1024px) 800px, 100vw"
      />

      <!-- Block Citation -->
      <BlockCitation
        v-else-if="block.type === 'quote'"
        :text="block.content?.text"
        :citation="block.content?.citation"
      />

      <!-- Block Galerie -->
      <BlockGalerie
        v-else-if="block.type === 'gallery' && block.content?.images?.length"
        :images="block.content.images"
        :caption="block.content?.caption"
      />

      <!-- Block Video -->
      <BlockVideo
        v-else-if="block.type === 'video'"
        :url="block.content?.url"
        :src="block.content?.src"
        :caption="block.content?.caption"
      />

      <!-- Block Ligne (separateur) -->
      <BlockLigne
        v-else-if="block.type === 'line' || block.type === 'rule'"
      />

      <!-- Block Liste -->
      <BlockListe
        v-else-if="block.type === 'list'"
        :text="block.content?.text"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ResponsiveImage } from '~/types/image'
import { isResponsiveImage } from '~/types/image'

type ResolvedBlock = {
  id?: string
  type: string
  content?: {
    text?: string
    level?: string
    image?: ResponsiveImage | { url: string; alt?: string } | null
    images?: (ResponsiveImage | { url: string; alt?: string })[]
    caption?: string
    citation?: string
    alt?: string
    url?: string
    src?: string
    [key: string]: unknown
  }
}

defineProps<{
  blocks?: ResolvedBlock[]
  isAuto?: boolean
}>()

function hasImage(block: ResolvedBlock): boolean {
  const img = block.content?.image
  if (!img) return false
  if (isResponsiveImage(img)) return true
  return typeof (img as any).url === 'string' && (img as any).url.length > 0
}
</script>

<style lang="scss">
.block-text {
  &.is-auto {
    // Styles pour le mode auto si necessaire
  }
}
</style>
