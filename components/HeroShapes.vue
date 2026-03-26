<template>
  <div class="hero-shapes">
    <!-- Cercle complet avec image à gauche -->
    <div class="hero-shapes_circle">
      <ResponsivePicture
        v-if="cover?.fallback?.src"
        :image="cover"
        alt=""
        loading="eager"
        picture-class="hero-shapes_picture"
      />
      <div v-else class="hero-shapes_placeholder"></div>
    </div>

    <!-- Demi-cercle blanc au milieu -->
    <div class="hero-shapes_semicircle-white"></div>

    <!-- Demi-cercle avec image à droite -->
    <div class="hero-shapes_semicircle-image">
      <ResponsivePicture
        v-if="coverRight?.fallback?.src"
        :image="coverRight"
        alt=""
        loading="eager"
        picture-class="hero-shapes_picture"
      />
      <div v-else class="hero-shapes_placeholder hero-shapes_placeholder--alt"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ResponsiveImage } from '~/types/image'

interface Props {
  cover?: ResponsiveImage | null
  coverRight?: ResponsiveImage | null
}

defineProps<Props>()
</script>

<style lang="scss">
.hero-shapes {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 50vw;
  z-index: 1;
}

// Cercle complet avec image (gauche)
.hero-shapes_circle {
  width: 50vw;
  height: 50vw;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

// Le <picture> prend toute la place du parent
.hero-shapes_picture {
  width: 100%;
  height: 100%;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}

.hero-shapes_placeholder {
  width: 100%;
  height: 100%;
  background-color: var(--beige);

  &--alt {
    background-color: var(--white);
  }
}

// Demi-cercle blanc (milieu)
.hero-shapes_semicircle-white {
  width: 25vw;
  height: 50vw;
  background-color: var(--white);
  border-radius: 0 25vw 25vw 0;
  flex-shrink: 0;
}

// Demi-cercle avec image (droite)
.hero-shapes_semicircle-image {
  width: 25vw;
  height: 50vw;
  border-radius: 0 25vw 25vw 0;
  overflow: hidden;
  flex-shrink: 0;

  .hero-shapes_picture {
    width: 200%;
    height: 100%;
    margin-left: -100%;

    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
