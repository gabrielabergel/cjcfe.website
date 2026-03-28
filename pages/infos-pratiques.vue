<template>
  <main class="page">
    <PageHero
      :titre="data?.result?.page?.titre"
      :soustitre="data?.result?.page?.soustitre"
      :cover="data?.result?.page?.cover"
      transparent
    />

    <!-- Demande de prières -->
    <section v-if="data?.result?.page?.prieres_titre" class="prieres">
      <div class="prieres_header">
        <AppBlocks :blocks="data?.result?.page?.prieres_page_titre" class="prieres_title" />
        <AppBlocks :blocks="data?.result?.page?.prieres_page_soustitre" class="prieres_subtitle" />
      </div>
      <div class="prieres_content">
        <div class="prieres_content_title">
          <h3>{{ data.result.page.prieres_titre }}</h3>
        </div>
        <div class="prieres_content_body">
          <p v-if="data.result.page.prieres_texte">{{ data.result.page.prieres_texte }}</p>
          <a v-if="data.result.page.prieres_bouton_url" :href="data.result.page.prieres_bouton_url" target="_blank" class="btn">
            {{ data.result.page.prieres_bouton_texte }}
          </a>
        </div>
      </div>
    </section>

    <!-- Nos activités -->
    <ListeActivite
      v-if="data?.result?.page?.activites?.length"
      :title="data.result.page.activites_titre || 'Nos activités'"
      :activites="data.result.page.activites"
    />

    <!-- Cotisations et Dons -->
    <section v-if="data?.result?.page?.dons_titre" class="dons">
      <div class="dons_header">
        <div class="dons_title">
          <h2>{{ data.result.page.dons_titre }}</h2>
        </div>
        <div class="dons_subtitle">
          <p v-if="data.result.page.dons_texte">{{ data.result.page.dons_texte }}</p>
          <a v-if="data.result.page.dons_bouton_url" :href="data.result.page.dons_bouton_url" target="_blank" class="btn">
            {{ data.result.page.dons_bouton_texte }}
          </a>
        </div>
      </div>
    </section>

    <!-- Accompagnement en cas de décès -->
    <section v-if="data?.result?.page?.deces_titre" class="deces">
      <div class="deces_header">
        <div class="deces_title">
          <h2>{{ data.result.page.deces_titre }}</h2>
        </div>
        <div class="deces_subtitle">
          <p v-if="data.result.page.deces_texte">{{ data.result.page.deces_texte }}</p>
          <a v-if="data.result.page.deces_bouton_url" :href="data.result.page.deces_bouton_url" target="_blank" class="btn">
            {{ data.result.page.deces_bouton_texte }}
          </a>
        </div>
      </div>
    </section>

  </main>
</template>

<script setup lang="ts">
import type { CMS_ImageObject } from '~/types/image'

type Activite = {
  titre: string
  description: string
}

type FetchData = CMS_API_Response & {
  result: {
    page: {
      title: string
      slug: string
      titre: CMS_API_Block[]
      soustitre: CMS_API_Block[]
      cover: CMS_ImageObject | null
      // Prières
      prieres_page_titre: CMS_API_Block[]
      prieres_page_soustitre: CMS_API_Block[]
      prieres_titre: string | null
      prieres_texte: string | null
      prieres_bouton_texte: string | null
      prieres_bouton_url: string | null
      // Activités
      activites_titre: string | null
      activites: Activite[]
      // Dons
      dons_titre: string | null
      dons_texte: string | null
      dons_bouton_texte: string | null
      dons_bouton_url: string | null
      // Décès
      deces_titre: string | null
      deces_texte: string | null
      deces_bouton_texte: string | null
      deces_bouton_url: string | null
    }
  }
}

const { data } = await useFetch<FetchData>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  body: {
    query: 'site',
    select: {
      page: {
        query: "site.find('infos-pratiques')",
        select: {
          title: true,
          slug: true,
          titre: 'page.titre.toBlocks',
          soustitre: 'page.soustitre.toBlocks',
          cover: {
            query: 'page.content.get("cover").toFile',
            select: {
              alt: 'file.alt.value',
              tiny: 'file.resize(50, null, 10)',
              small: 'file.resize(500)',
              reg: 'file.resize(1280)',
              large: 'file.resize(1920)',
              xxl: 'file.resize(2500)',
              focus: 'file.focus',
            },
          },
          // Prières
          prieres_page_titre: 'page.prieres_page_titre.toBlocks',
          prieres_page_soustitre: 'page.prieres_page_soustitre.toBlocks',
          prieres_titre: true,
          prieres_texte: true,
          prieres_bouton_texte: true,
          prieres_bouton_url: true,
          // Activités
          activites_titre: true,
          activites: {
            query: 'page.activites.toStructure',
            select: {
              titre: true,
              description: true,
            },
          },
          // Dons
          dons_titre: true,
          dons_texte: true,
          dons_bouton_texte: true,
          dons_bouton_url: true,
          // Décès
          deces_titre: true,
          deces_texte: true,
          deces_bouton_texte: true,
          deces_bouton_url: true,
        },
      },
    },
  },
})
</script>

<style lang="scss">
.page {
  padding-top: 80px;
}

.prieres {
  // Container sans fond, chaque sous-section a son propre fond
}

.prieres_header {
  padding: var(--40);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
  background-color: var(--beige);
}

.prieres_title {
  flex: 1;

  h1, h2, h3 {
    color: var(--white);
    font-size: 80px;
    margin: 0;
    line-height: 1.1;
  }
}

.prieres_subtitle {
  flex: 1;

  p {
    color: var(--white);
    font-size: 18px;
    line-height: 1.5;
    margin: 0;
  }
}

.prieres_content {
  padding: var(--40);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
  background-color: var(--blue);
}

.prieres_content_title {
  flex: 1;

  h3 {
    color: var(--white);
    font-size: 80px;
    margin: 0;
    line-height: 1.1;
  }
}

.prieres_content_body {
  flex: 1;

  p {
    color: var(--white);
    font-size: 18px;
    line-height: 1.5;
    margin: 0 0 var(--20);
    white-space: pre-line;
  }

  .btn {
    background-color: var(--white);
    color: var(--blue);
    border: none;

    &:hover {
      background-color: var(--beige);
      color: var(--white);
      opacity: 1;
    }
  }
}

@media screen and (max-width: 991px) {
  .prieres_title,
  .prieres_content_title,
  .dons_title {
    h1, h2, h3 {
      font-size: 60px;
    }
  }

  .prieres_subtitle,
  .prieres_content_body,
  .dons_subtitle {
    p {
      font-size: 16px;
    }
  }
}

@media screen and (max-width: 767px) {
  .prieres_header,
  .prieres_content,
  .dons_header {
    flex-direction: column;
    gap: 20px;
    padding: 30px;
  }

  .prieres_title,
  .prieres_content_title,
  .dons_title {
    h1, h2, h3 {
      font-size: 48px;
    }
  }
}

@media screen and (max-width: 479px) {
  .prieres_header,
  .prieres_content,
  .dons_header {
    padding: 20px;
  }

  .prieres_title,
  .prieres_content_title,
  .dons_title {
    h1, h2, h3 {
      font-size: 45px;
    }
  }

  .prieres_subtitle,
  .prieres_content_body,
  .dons_subtitle {
    p {
      font-size: 14px;
    }
  }
}

.dons {
  background-color: var(--white);
}

.dons_header {
  padding: var(--40);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
}

.dons_title {
  flex: 1;

  h2 {
    color: var(--blue);
    font-size: 80px;
    margin: 0;
    line-height: 1.1;
  }
}

.dons_subtitle {
  flex: 1;

  p {
    color: var(--blue);
    font-size: 18px;
    line-height: 1.5;
    margin: 0 0 var(--20);
    white-space: pre-line;
  }

  .btn {
    &:hover {
      background-color: var(--beige);
      color: var(--white);
      opacity: 1;
    }
  }
}

@media screen and (max-width: 991px) {
  .dons_header {
    flex-direction: column;
    gap: 20px;
  }

  .dons_title h2 {
    font-size: 60px;
  }

  .dons_subtitle p {
    font-size: 16px;
  }
}

@media screen and (max-width: 767px) {
  .dons_header {
    padding: 30px;
  }

  .dons_title h2 {
    font-size: 48px;
  }
}

@media screen and (max-width: 479px) {
  .dons_header {
    padding: 20px;
  }

  .dons_title h2 {
    font-size: 45px;
  }

  .dons_subtitle p {
    font-size: 14px;
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background-color: var(--blue);
  color: var(--white);
  text-decoration: none;
  border-radius: 100px;
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 500;
  border: 2px solid var(--blue);
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background-color: var(--beige);
    border-color: var(--beige);
    color: var(--black);
  }
}

.deces {
  background-color: var(--beige);
}

.deces_header {
  padding: var(--40);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
}

.deces_title {
  flex: 1;

  h2 {
    color: var(--white);
    font-size: 80px;
    margin: 0;
    line-height: 1.1;
  }
}

.deces_subtitle {
  flex: 1;

  p {
    color: var(--white);
    font-size: 18px;
    line-height: 1.5;
    margin: 0 0 var(--20);
    white-space: pre-line;
  }

  .btn {
    background-color: var(--white);
    color: var(--beige);

    &:hover {
      background-color: var(--blue);
      color: var(--white);
      opacity: 1;
    }
  }
}

@media screen and (max-width: 991px) {
  .deces_title {
    h2 {
      font-size: 60px;
    }
  }

  .deces_subtitle {
    p {
      font-size: 16px;
    }
  }
}

@media screen and (max-width: 767px) {
  .deces_header {
    flex-direction: column;
    gap: 20px;
    padding: 30px;
  }

  .deces_title {
    h2 {
      font-size: 48px;
    }
  }
}

@media screen and (max-width: 479px) {
  .deces_header {
    padding: 20px;
  }

  .deces_title {
    h2 {
      font-size: 45px;
    }
  }

  .deces_subtitle {
    p {
      font-size: 14px;
    }
  }
}
</style>
