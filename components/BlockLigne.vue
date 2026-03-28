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
  background-color: var(--blue);
  
  // Sortir du container pour prendre toute la largeur
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
</style>
