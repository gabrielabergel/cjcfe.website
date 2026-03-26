<template>
  <figure v-if="embedUrl || src" class="block-video">
    <!-- Video YouTube/Vimeo embeddee -->
    <div v-if="embedUrl" class="block-video_wrapper">
      <iframe
        :src="embedUrl"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="block-video_iframe"
      />
    </div>
    <!-- Video locale -->
    <video
      v-else-if="src"
      :src="src"
      :poster="poster"
      controls
      class="block-video_player"
    >
      Votre navigateur ne supporte pas la lecture de vidéos.
    </video>
    <figcaption v-if="caption" class="block-video_caption">{{ caption }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
const props = defineProps<{
  url?: string
  src?: string
  poster?: string
  caption?: string
}>()

const embedUrl = computed(() => {
  if (!props.url) return ''

  // YouTube
  const youtubeMatch = props.url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }

  // Vimeo
  const vimeoMatch = props.url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  return ''
})
</script>

<style lang="scss">
.block-video {
  margin: var(--20) 0;

  &_wrapper {
    position: relative;
    padding-bottom: 56.25%; // Ratio 16:9
    height: 0;
    overflow: hidden;
    border-radius: var(--radius, 8px);
  }

  &_iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &_player {
    width: 100%;
    height: auto;
    border-radius: var(--radius, 8px);
    background-color: #000;
  }

  &_caption {
    margin-top: var(--10);
    font-size: 14px;
    color: #666;
    font-style: italic;
  }
}
</style>
