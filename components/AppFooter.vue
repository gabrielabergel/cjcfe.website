<template>
  <footer class="footer">
    <div class="footer_content">
      <!-- Grille 5 colonnes -->
      <div class="footer_grid">
        <!-- Colonnes 1-2 : Contact -->
        <div class="footer_col footer_col--contact">
          <h1 class="footer_contact_title">Contactez-nous</h1>
          <p class="footer_contact_text">
            Une question, une demande d'information ?<br />
            N'hésitez pas à nous contacter.
          </p>
          <AppButton to="/contact" variant="outline-white">
            Nous contacter
          </AppButton>
        </div>

        <!-- Colonne 3 vide -->
        <div class="footer_col"></div>

        <!-- Colonnes 4-5 : Navigation -->
        <div class="footer_col footer_col--nav">
          <nav class="footer_nav">
            <h3 class="footer_section_title">Navigation</h3>
            <NuxtLink to="/notre-histoire" class="footer_nav_link">Notre histoire</NuxtLink>
            <NuxtLink to="/qui-sommes-nous" class="footer_nav_link">Qui sommes-nous ?</NuxtLink>
            <NuxtLink to="/articles" class="footer_nav_link">Actualités</NuxtLink>
            <NuxtLink to="/infos-pratiques" class="footer_nav_link">Infos pratiques</NuxtLink>
            <NuxtLink to="/contact" class="footer_nav_link">Contact</NuxtLink>
          </nav>
          <nav class="footer_legal">
            <h3 class="footer_section_title">Informations</h3>
            <NuxtLink to="/mentions-legales" class="footer_nav_link">Mentions légales</NuxtLink>
            <NuxtLink to="/protection-des-donnees" class="footer_nav_link">Protection des données</NuxtLink>
          </nav>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="footer_bottom">
      <div class="footer_aci">
        A.C.I : Association Culturelle Israélite de Clermont-Ferrand
      </div>
      <div class="footer_copyright">
        © {{ new Date().getFullYear() }} CJCFE. Tous droits réservés.
      </div>
      <div v-if="contact?.logos?.length" class="footer_partners">
        <img
          v-for="(logo, index) in contact.logos"
          :key="index"
          :src="logo.url"
          loading="lazy"
          :alt="logo.alt || ''"
          class="footer_partner_logo"
        >
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
type FooterFetchData = CMS_API_Response & {
  result: {
    contact: {
      address: string | null
      email: string | null
      phone: string | null
      logos: CMS_API_File[]
    }
  }
}

const { data } = await useFetch<FooterFetchData>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  body: {
    query: 'site',
    select: {
      contact: {
        query: "site.find('contact')",
        select: {
          address: true,
          email: true,
          phone: true,
          logos: {
            query: 'page.logos.toFiles',
            select: {
              url: true,
              alt: true,
            },
          },
        },
      },
    },
  },
})

const contact = computed(() => data.value?.result?.contact)
</script>

<style lang="scss">
.footer {
  width: 100%;
  min-height: 100vh;
  background-color: var(--blue);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 2400px;
  margin-left: auto;
  margin-right: auto;
}

.footer_content {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 80px var(--40);
}

// Grille 5 colonnes
.footer_grid {
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  gap: 40px;
  width: 100%;
  align-items: center;
}

.footer_col {
  &--contact {
    grid-column: span 1;
  }

  &--nav {
    grid-column: span 1;
    display: flex;
    gap: 60px;
  }
}

// Contact title (big like Actualités)
.footer_contact_title {
  font-family: var(--font-title);
  font-size: 128px;
  color: var(--white);
  text-transform: uppercase;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 30px;
}

// Section titles for nav (small, thin, beige)
.footer_section_title {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--beige);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
  font-weight: 400;
}

.footer_contact_text {
  font-family: var(--font-body);
  font-size: 18px;
  color: var(--white);
  opacity: 0.9;
  margin-bottom: 30px;
  line-height: 1.6;
}

// Navigation
.footer_nav,
.footer_legal {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer_nav_link {
  color: var(--white);
  text-decoration: none;
  font-size: 16px;
  font-family: var(--font-body);
  opacity: 0.85;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
}

// Bottom bar
.footer_bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 30px var(--40);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.footer_aci {
  color: var(--white);
  font-size: 14px;
  font-family: var(--font-body);
  opacity: 0.8;
}

.footer_copyright {
  color: var(--white);
  font-size: 14px;
  opacity: 0.6;
}

.footer_partners {
  display: flex;
  gap: 20px;
  align-items: center;
}

.footer_partner_logo {
  height: 40px;
  width: auto;
  opacity: 0.8;
}

// Media queries
@media screen and (max-width: 991px) {
  .footer_content {
    padding: 60px var(--20);
  }

  .footer_grid {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }

  .footer_col:nth-child(2) {
    display: none;
  }

  .footer_col--nav {
    flex-direction: column;
    gap: 30px;
  }

  .footer_contact_title {
    font-size: 72px;
  }
}

@media screen and (max-width: 767px) {
  .footer_content {
    padding: 50px var(--20);
  }

  .footer_grid {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .footer_col--contact {
    order: 1;
  }

  .footer_col--nav {
    order: 2;
    align-items: center;
  }

  .footer_nav,
  .footer_legal {
    align-items: center;
  }

  .footer_bottom {
    flex-direction: column;
    text-align: center;
    padding: 20px var(--20);
  }
}

@media screen and (max-width: 767px) {
  .footer_contact_title {
    font-size: 56px;
  }
}

@media screen and (max-width: 479px) {
  .footer_contact_title {
    font-size: 48px;
  }

  .footer_contact_text {
    font-size: 14px;
  }
}
</style>
