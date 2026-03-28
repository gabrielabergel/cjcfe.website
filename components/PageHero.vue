<template>
  <section class="page-hero" :class="{ 'is-transparent': transparent }">
    <!-- Image cover -->
    <div v-if="!transparent" class="page-hero_image">
      <img
        v-if="cover?.reg?.url"
        :src="cover.xxl?.url || cover.reg.url"
        :alt="cover.alt || ''"
        class="page-hero_img"
        :style="{ objectPosition: cover.focus || 'center' }"
      />
      <div v-else class="page-hero_placeholder" />
    </div>

    <!-- Bandeau titre et description -->
    <div class="page-hero_banner">
      <div class="page-hero_content">
        <AppBlocks v-if="titre?.length" :blocks="titre" class="page-hero_title" />
        <AppBlocks v-if="soustitre?.length" :blocks="soustitre" class="page-hero_subtitle" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CMS_ImageObject } from '~/types/image'

interface Props {
  titre?: CMS_API_Block[]
  soustitre?: CMS_API_Block[]
  cover?: CMS_ImageObject | null
  transparent?: boolean
}

withDefaults(defineProps<Props>(), {
  transparent: false
})
</script>

<style lang="scss">
.page-hero {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  &.is-transparent {
    min-height: auto;
    padding-top: var(--80, 80px);

    .page-hero_content {
      background-color: transparent;
      backdrop-filter: none;
    }

    .page-hero_title {
      h1, h2, h3 {
        color: var(--blue);
      }
    }

    .page-hero_subtitle {
      p {
        color: var(--blue);
      }
    }
  }
}

.page-hero_image {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.page-hero_img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.page-hero_placeholder {
  width: 100%;
  height: 100%;
  background-color: var(--blue);
}

// Bandeau en bas
.page-hero_banner {
  position: relative;
  z-index: 10;
  width: 100%;
}

.page-hero_content {
  width: 100%;
  background-color: rgba(0, 96, 168, 0.65);
  backdrop-filter: blur(8px);
  padding: 40px 40px 120px 40px; // 120px en bas pour laisser place au bandeau Shabbat
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
}

.page-hero_title {
  flex: 1;

  h1, h2, h3 {
    color: var(--white);
    font-size: 80px;
    margin: 0;
    line-height: 1.1;
  }
}

.page-hero_subtitle {
  flex: 1;

  p {
    color: var(--white);
    font-size: 18px;
    line-height: 1.5;
    margin: 0;
  }
}

// Media queries
@media screen and (max-width: 991px) {
  .page-hero {
    min-height: 100vh;
  }

  .page-hero_title {
    h1, h2, h3 {
      font-size: 60px;
    }
  }

  .page-hero_subtitle {
    p {
      font-size: 16px;
    }
  }
}

@media screen and (max-width: 767px) {
  .page-hero {
    min-height: 100vh;
  }

  .page-hero_content {
    flex-direction: column;
    gap: 20px;
    padding: 30px 30px 70px 30px;
  }

  .page-hero_title {
    h1, h2, h3 {
      font-size: 48px;
    }
  }

  .page-hero_subtitle {
    p {
      font-size: 16px;
    }
  }
}

@media screen and (max-width: 479px) {
  .page-hero_content {
    padding: 20px 20px 70px 20px;
  }

  .page-hero_title {
    h1, h2, h3 {
      font-size: 45px;
    }
  }

  .page-hero_subtitle {
    p {
      font-size: 14px;
    }
  }
}
</style>
