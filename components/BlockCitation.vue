<template>
  <blockquote class="block-citation">
    <div v-if="text" class="block-citation_text" v-html="text" />
    <footer v-if="citation" class="block-citation_author" v-html="citation" />
  </blockquote>
</template>

<script setup lang="ts">
defineProps<{
  text?: string
  citation?: string
}>()
</script>

<style lang="scss">
.block-citation {
  margin: var(--60, 60px) 0;
  padding: var(--40) var(--20);
  text-align: center;
  border: none;
  border-left: none;

  &_text {
    font-family: var(--font-title);
    font-size: clamp(24px, 4vw, 40px);
    font-style: italic;
    line-height: 1.4;
    color: var(--beige);

    p {
      margin: 0;
    }
  }

  &_author {
    margin-top: var(--20);
    font-size: 16px;
    color: #666;
    font-weight: 500;

    &::before {
      content: '— ';
    }
  }
}
</style>
