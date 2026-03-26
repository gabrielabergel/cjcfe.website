<template>
  <component
    :is="tag"
    class="block-titre"
    :class="`block-titre--${tag}`"
    v-html="text"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  text?: string
  level?: string
}>()

const tag = computed(() => {
  const level = props.level
  if (typeof level === 'string' && /^h[1-6]$/.test(level)) {
    return level
  }
  return 'h2'
})
</script>

<style lang="scss">
.block-titre {
  font-family: var(--font-title);
  color: var(--blue);
  margin: 0 0 var(--20);
  line-height: 1.2;

  &--h1 {
    font-size: clamp(32px, 5vw, 64px);
  }

  &--h2 {
    font-size: clamp(24px, 4vw, 48px);
  }

  &--h3 {
    font-size: clamp(20px, 3vw, 32px);
  }

  &--h4 {
    font-size: clamp(18px, 2.5vw, 24px);
  }

  &--h5 {
    font-size: clamp(16px, 2vw, 20px);
  }

  &--h6 {
    font-size: clamp(14px, 1.5vw, 18px);
  }
}
</style>
