<template>
  <component
    :is="href ? 'a' : to ? NuxtLink : 'button'"
    :href="href"
    :to="to"
    :target="href ? '_blank' : undefined"
    :rel="href ? 'noopener noreferrer' : undefined"
    class="app-button"
    :class="[`app-button--${variant}`]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
const NuxtLink = resolveComponent('NuxtLink')

defineProps<{
  to?: string
  href?: string
  variant?: 'primary' | 'outline-white' | 'outline-blue' | 'beige'
}>()
</script>

<style lang="scss">
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 500;
  padding: 12px 24px;
  border-radius: 100px;
  text-decoration: none;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  // Primary: fond noir, texte blanc
  &--primary {
    background-color: var(--black);
    color: var(--white);
    border-color: var(--black);

    &:hover {
      background-color: var(--blue);
      border-color: var(--blue);
    }
  }

  // Outline white: contour blanc, texte blanc, fond transparent
  &--outline-white {
    background-color: transparent;
    color: var(--white);
    border-color: var(--white);

    &:hover {
      background-color: var(--beige);
      border-color: var(--beige);
      color: var(--black);
    }
  }

  // Outline blue: contour bleu, texte bleu, fond transparent
  &--outline-blue {
    background-color: transparent;
    color: var(--blue);
    border-color: var(--blue);

    &:hover {
      background-color: var(--blue);
      color: var(--white);
    }
  }

  // Beige: fond beige, texte noir
  &--beige {
    background-color: var(--beige);
    color: var(--black);
    border-color: var(--beige);

    &:hover {
      background-color: var(--white);
      border-color: var(--white);
      color: var(--blue);
    }
  }
}
</style>
