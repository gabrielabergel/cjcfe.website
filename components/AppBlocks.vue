<template>
  <div v-if="blocks?.length" class="v-blocks">
    <template v-for="block in blocks" :key="block.id">
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
        v-else-if="block.type === 'image' && (block.content?.imageData || block.content?.image)"
        :image="block.content?.imageData || block.content?.image"
        :alt="block.content?.alt"
        :caption="block.content?.caption"
      />

      <!-- Block Galerie -->
      <BlockGalerie
        v-else-if="block.type === 'gallery' && (block.content?.imagesData?.length || block.content?.images?.length)"
        :images="block.content?.imagesData || block.content?.images"
        :caption="block.content?.caption"
      />

      <!-- Block Citation -->
      <BlockCitation
        v-else-if="block.type === 'quote'"
        :text="block.content?.text"
        :citation="block.content?.citation"
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
defineProps<{
  blocks?: CMS_API_Block[]
}>()
</script>

<style lang="scss">
.v-blocks {
  // Les styles sont dans chaque composant Block*
}
</style>

