<template>
  <section class="page-header" :class="{ 'is-blue': variant === 'blue' }">
    <div class="page-header_content">
      <div class="page-header_title">
        <!-- Blocs CMS -->
        <AppBlocks v-if="titre?.length" :blocks="titre" />
        <!-- Texte simple -->
        <h1 v-else-if="titreText">{{ titreText }}</h1>
      </div>
      <div class="page-header_right">
        <p v-if="date" class="page-header_date">{{ formattedDate }}</p>
        <div class="page-header_subtitle">
          <!-- Blocs CMS -->
          <AppBlocks v-if="soustitre?.length" :blocks="soustitre" />
          <!-- Texte simple -->
          <p v-else-if="soustitreText">{{ soustitreText }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  titre?: CMS_API_Block[]
  titreText?: string
  soustitre?: CMS_API_Block[]
  soustitreText?: string
  date?: string
  variant?: 'blue' | 'transparent'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'transparent'
})

const formattedDate = computed(() => {
  if (!props.date) return ''
  const dateObj = new Date(props.date)
  return dateObj.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})
</script>

<style lang="scss">
.page-header {
  width: 100%;
  padding: var(--80, 80px) var(--40) var(--40);

  // Variante transparente (défaut) - texte bleu
  &:not(.is-blue) {
    background-color: transparent;

    .page-header_title {
      h1, h2, h3 {
        color: var(--blue);
      }
    }

    .page-header_subtitle {
      p {
        color: var(--blue);
      }
    }
  }

  // Variante bleue - texte blanc
  &.is-blue {
    background-color: var(--blue);

    .page-header_title {
      h1, h2, h3 {
        color: var(--white);
      }
    }

    .page-header_subtitle {
      p {
        color: var(--white);
      }
    }
  }
}

.page-header_content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
}

.page-header_title {
  flex: 1;

  h1, h2, h3 {
    font-size: clamp(36px, 6vw, 80px);
    margin: 0;
    line-height: 1.1;
    text-transform: uppercase;
    font-family: var(--font-title);
  }
}

.page-header_right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--10);
}

.page-header_date {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
  opacity: 0.7;
}

.page-header_subtitle {
  p {
    font-size: 18px;
    line-height: 1.5;
    margin: 0;
  }
}

// Media queries
@media screen and (max-width: 991px) {
  .page-header_title {
    h1, h2, h3 {
      font-size: clamp(32px, 5vw, 60px);
    }
  }

  .page-header_subtitle {
    p {
      font-size: 16px;
    }
  }
}

@media screen and (max-width: 767px) {
  .page-header {
    padding: var(--20);
  }

  .page-header_content {
    flex-direction: column;
    gap: 20px;
  }

  .page-header_title {
    h1, h2, h3 {
      font-size: clamp(28px, 8vw, 48px);
    }
  }

  .page-header_subtitle {
    p {
      font-size: 16px;
    }
  }
}

@media screen and (max-width: 479px) {
  .page-header {
    padding: var(--10);
  }

  .page-header_subtitle {
    p {
      font-size: 14px;
    }
  }
}
</style>
