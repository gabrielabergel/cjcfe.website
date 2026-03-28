<template>
  <main class="page">
    <PageHero
      :titre="data?.result?.page?.titre"
      :soustitre="data?.result?.page?.soustitre"
      :cover="data?.result?.page?.cover"
      transparent
    />

    <!-- Formulaire de contact -->
    <section class="contact-form-section">
      <div class="contact-form-title">
        <h2>{{ data?.result?.page?.contact_titre || 'Nous contacter' }}</h2>
      </div>
      <div class="contact-form-content">
        <ContactForm />
      </div>
    </section>

    <!-- Liste des membres (style bandeau comme ShabbatBanner) -->
    <section v-if="data?.result?.page?.membres?.length" class="membres-banner">
      <div class="membres-banner_content">
        <div
          v-for="(membre, index) in data.result.page.membres"
          :key="index"
          class="membres-banner_item"
        >
          <span v-if="membre.description" class="membres-banner_label">{{ membre.description }}</span>
          <span class="membres-banner_value">{{ membre.prenom }} {{ membre.nom }}</span>
          <div v-if="membre.email || membre.telephone" class="membres-banner_contact">
            <a v-if="membre.email" :href="`mailto:${membre.email}`">{{ membre.email }}</a>
            <a v-if="membre.telephone" :href="`tel:${membre.telephone}`">{{ membre.telephone }}</a>
          </div>
        </div>
      </div>
    </section>

      </main>
</template>

<script setup lang="ts">
import type { CMS_ImageObject } from '~/types/image'

type Membre = {
  photo: CMS_API_File[]
  nom: string
  prenom: string
  telephone: string | null
  email: string | null
  description: string | null
}

type FetchData = CMS_API_Response & {
  result: {
    page: {
      title: string
      slug: string
      titre: CMS_API_Block[]
      soustitre: CMS_API_Block[]
      cover: CMS_ImageObject | null
      membres: Membre[]
      contact_titre: string | null
      contact_soustitre: string | null
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
        query: "site.find('contact')",
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
          membres: {
            query: 'page.membres.toStructure',
            select: {
              photo: {
                query: 'structureItem.photo.toFiles',
                select: {
                  url: 'file.devUrl',
                  alt: true,
                },
              },
              nom: true,
              prenom: true,
              telephone: true,
              email: true,
              description: true,
            },
          },
          contact_titre: true,
          contact_soustitre: true,
        },
      },
    },
  },
})
</script>

<style lang="scss" scoped>
.page {
  padding-top: 80px;
}

// Membres banner (style comme ShabbatBanner)
.membres-banner {
  background-color: var(--beige);
  width: 100%;
}

.membres-banner_content {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
}

.membres-banner_item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--20) var(--15);
  border-right: 1px solid rgba(255, 255, 255, 0.2);

  &:last-child {
    border-right: none;
  }
}

.membres-banner_label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 6px;
}

.membres-banner_value {
  font-size: 16px;
  font-weight: 600;
  color: var(--white);
  margin-bottom: 8px;
}

.membres-banner_contact {
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: var(--white);
      text-decoration: underline;
    }
  }
}

@media screen and (max-width: 991px) {
  .membres-banner_content {
    flex-wrap: wrap;
  }

  .membres-banner_item {
    flex: 1 1 50%;
    min-width: 50%;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);

    &:nth-child(odd) {
      border-right: 1px solid rgba(255, 255, 255, 0.2);
    }

    &:nth-last-child(-n+2) {
      border-bottom: none;
    }
  }
}

@media screen and (max-width: 479px) {
  .membres-banner_item {
    flex: 1 1 100%;
    min-width: 100%;
    padding: var(--15) var(--10);
    border-right: none;

    &:nth-child(odd) {
      border-right: none;
    }
  }

  .membres-banner_label {
    font-size: 10px;
  }

  .membres-banner_value {
    font-size: 14px;
  }
}

// Section formulaire de contact
.contact-form-section {
  padding: var(--40);
  background-color: var(--white);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
}

.contact-form-title {
  flex: 1;

  h2 {
    color: var(--blue);
    font-family: var(--font-title);
    font-size: clamp(32px, 5vw, 80px);
    text-transform: uppercase;
    margin: 0;
    line-height: 1.1;
  }
}

.contact-form-content {
  flex: 1;
}

@media screen and (max-width: 991px) {
  .contact-form-section {
    flex-direction: column;
    gap: 30px;
  }

  .contact-form-content {
    width: 100%;
  }

  .contact-form-title h2 {
    font-size: clamp(32px, 5vw, 60px);
  }
}

@media screen and (max-width: 479px) {
  .contact-form-section {
    padding: 20px;
  }

  .contact-form-title h2 {
    font-size: 45px;
  }
}

</style>
