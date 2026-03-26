<template>
  <hr class="block-ligne" />
</template>

<script setup lang="ts">
</script>

<style lang="scss">
.block-ligne {
  margin: var(--40) 0;
  border: none;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--blue) 20%,
    var(--blue) 80%,
    transparent
  );
  opacity: 0.3;
}
</style>
