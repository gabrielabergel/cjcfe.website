<template>
  <section class="hero">
    <!-- Image de fond -->
    <img
      v-if="cover?.fallback?.src"
      :src="cover.fallback.src"
      :alt="cover.alt || ''"
      class="hero_background"
    />
    <img v-else src="/images/hero-visuel-02.svg" class="hero_background" alt="" />

    <!-- Bandeaux en bas -->
    <div class="hero_banners">
      <!-- Bandeau titre -->
      <div class="hero_content">
        <AppBlocks v-if="titre?.length" :blocks="titre" class="hero_title" />
        <AppBlocks v-if="soustitre?.length" :blocks="soustitre" class="hero_subtitle" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ResponsiveImage } from '~/types/image'

interface Props {
  titre?: CMS_API_Block[]
  soustitre?: CMS_API_Block[]
  cover?: ResponsiveImage | null
}

defineProps<Props>()
</script>

<style lang="scss">
// Hero section styles
.hero {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  background-color: var(--blue);
}

// Image de fond
.hero_background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

// Container des bandeaux en bas
.hero_banners {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
}

// Bandeau titre - au-dessus du bandeau horaires
.hero_content {
  position: relative;
  z-index: 10;
  width: 100%;
  background-color: rgba(0, 96, 168, 0.65); // Bleu avec transparence
  backdrop-filter: blur(8px);
  padding: 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
}

.hero_title {
  flex: 1;

  h1, h2 {
    color: var(--white);
    font-size: 80px;
    margin: 0;
    line-height: 1.1;
  }
}

.hero_subtitle {
  flex: 1;

  p {
    color: var(--white);
    font-size: 18px;
    line-height: 1.5;
    margin: 0;
  }
}

// Bandeau Shabbat en dessous du titre
.hero_banners :deep(.shabbat-banner) {
  width: 100%;
}

// Media queries
@media screen and (max-width: 991px) {
  .hero_title {
    h1, h2 {
      font-size: 60px;
    }
  }

  .hero_subtitle {
    p {
      font-size: 16px;
    }
  }
}

@media screen and (max-width: 767px) {
  .hero_content {
    flex-direction: column;
    gap: 20px;
    padding: 30px;
  }

  .hero_title {
    h1, h2 {
      font-size: 48px;
    }
  }

  .hero_subtitle {
    p {
      font-size: 16px;
    }
  }
}

@media screen and (max-width: 479px) {
  .hero_content {
    padding: 20px;
  }

  .hero_title {
    h1, h2 {
      font-size: 36px;
    }
  }

  .hero_subtitle {
    p {
      font-size: 14px;
    }
  }
}
</style>
