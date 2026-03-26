<template>
  <div v-if="text" class="block-liste" v-html="text" />
</template>

<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<style lang="scss">
.block-liste {
  margin: var(--20) 0;
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-color, #333);

  ul, ol {
    margin: 0;
    padding-left: 1.5em;
  }

  li {
    margin-bottom: 0.75em;
    position: relative;

    &:last-child {
      margin-bottom: 0;
    }
  }

  ul {
    list-style: none;

    li::before {
      content: '';
      position: absolute;
      left: -1.2em;
      top: 0.6em;
      width: 6px;
      height: 6px;
      background-color: var(--blue);
      border-radius: 50%;
    }
  }

  ol {
    list-style: decimal;

    li::marker {
      color: var(--blue);
      font-weight: 600;
    }
  }

  a {
    color: var(--blue);
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
}
</style>
