<template>
  <div class="block-texte" v-html="text" />
</template>

<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<style lang="scss">
.block-texte {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-color, #333);
  margin: 0 0 var(--20);
  white-space: pre-line; // Préserve les sauts de ligne

  p {
    margin: 0 0 1em;

    &:last-child {
      margin-bottom: 0;
    }
  }

  a {
    color: var(--blue);
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }

  strong {
    font-weight: 600;
  }

  em {
    font-style: italic;
  }

  ul, ol {
    margin: 1em 0;
    padding-left: 1.5em;
  }

  li {
    margin-bottom: 0.5em;
  }
}
</style>
