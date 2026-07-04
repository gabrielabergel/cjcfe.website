<template>
  <!--
    Anti-scraping : aucun href mailto:/tel: n'est présent dans le DOM.
    Le lien est construit et ouvert uniquement au clic (JS).
    Combiné au rendu SPA (rien dans le HTML initial), cela bloque
    les robots récolteurs d'adresses les plus courants.
  -->
  <a
    href="#"
    class="obfuscated-contact"
    :aria-label="ariaLabel"
    @click="onActivate"
  >{{ value }}</a>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: string
  type: 'email' | 'tel'
}>()

const ariaLabel = computed(() =>
  props.type === 'email' ? 'Envoyer un email' : 'Appeler'
)

const onActivate = (event: MouseEvent) => {
  event.preventDefault()
  const href =
    props.type === 'email'
      ? `mailto:${props.value}`
      : `tel:${props.value.replace(/[^\d+]/g, '')}`
  window.location.href = href
}
</script>

<style scoped>
.obfuscated-contact {
  cursor: pointer;
}
</style>
