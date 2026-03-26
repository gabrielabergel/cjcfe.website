<template>
  <component
    :is="link ? NuxtLink : 'div'"
    v-if="text"
    :to="link || undefined"
    class="marquee-banner"
  >
    <div class="marquee-banner_track">
      <template v-for="i in 10" :key="i">
        <span class="marquee-banner_text">{{ text }}</span>
        <span class="marquee-banner_dot"></span>
      </template>
    </div>
    <div class="marquee-banner_track" aria-hidden="true">
      <template v-for="i in 10" :key="'b' + i">
        <span class="marquee-banner_text">{{ text }}</span>
        <span class="marquee-banner_dot"></span>
      </template>
    </div>
  </component>
</template>

<script setup lang="ts">
const NuxtLink = resolveComponent('NuxtLink')

const props = defineProps<{
  text?: string | null
  link?: string | null
}>()

const { setBanner, bannerHeight } = useBanner()

// Mettre à jour l'état du bandeau
watch(() => props.text, (newText) => {
  setBanner(!!newText)
}, { immediate: true })

onUnmounted(() => {
  setBanner(false)
})
</script>

<style lang="scss">
.marquee-banner {
  width: 100%;
  background-color: var(--blue);
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 950;
  padding: 10px 0;
  display: flex;
  text-decoration: none;
  cursor: default;

  &[href] {
    cursor: pointer;
  }
}

.marquee-banner_track {
  display: flex;
  align-items: center;
  white-space: nowrap;
  animation: marquee 90s linear infinite;
  flex-shrink: 0;
}

.marquee-banner_text {
  color: var(--white);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  flex-shrink: 0;
}

.marquee-banner_dot {
  width: 6px;
  height: 6px;
  background-color: var(--white);
  border-radius: 50%;
  margin: 0 20px;
  flex-shrink: 0;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
