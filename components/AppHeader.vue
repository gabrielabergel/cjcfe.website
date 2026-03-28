<template>
  <div class="header_container">
    <header class="header" :class="{ 'has-banner': hasBanner }">
      <NuxtLink to="/" class="header_logo">
        <img src="/images/logo-cjcfe.svg" alt="CJCFE" class="header_logo_image" />
      </NuxtLink>

      <nav class="header_nav">
        <AppButton
          v-if="donationUrl"
          :href="donationUrl"
          variant="outline-white"
        >
          Nous soutenir
        </AppButton>
        <div class="header_menu_icon" :class="{ 'is-open': menuOpen }" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>
    </header>

    <!-- Overlay assombrissement (pleine page) -->
    <div class="header_overlay" :class="{ 'is-open': menuOpen }" @click="closeMenu"></div>

    <!-- Menu déroulant -->
    <div class="header_menu" :class="{ 'is-open': menuOpen, 'has-banner': hasBanner }">
      <nav class="header_menu_nav">
        <NuxtLink to="/" class="header_menu_link" @click="closeMenu">Accueil</NuxtLink>
        <NuxtLink to="/notre-histoire" class="header_menu_link" @click="closeMenu">Notre histoire</NuxtLink>
        <NuxtLink to="/qui-sommes-nous" class="header_menu_link" @click="closeMenu">Qui sommes-nous ?</NuxtLink>
        <NuxtLink to="/articles" class="header_menu_link" @click="closeMenu">Actualités</NuxtLink>
        <NuxtLink to="/infos-pratiques" class="header_menu_link" @click="closeMenu">Infos pratiques</NuxtLink>
        <NuxtLink to="/contact" class="header_menu_link" @click="closeMenu">Contact</NuxtLink>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
const { hasBanner } = useBanner()

const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}

// Fetch donation URL from CMS
type InfosData = {
  result: {
    donsBoutonUrl: string | null
  }
}

const { data } = await useFetch<InfosData>('/api/CMS_KQLRequest', {
  method: 'POST',
  body: {
    query: "site.find('infos-pratiques')",
    select: {
      donsBoutonUrl: 'page.dons_bouton_url',
    },
  },
})

const donationUrl = computed(() => data.value?.result?.donsBoutonUrl || null)
</script>

<style lang="scss">
.header {
  width: calc(100% - 40px);
  height: 60px;
  background-color: rgba(0, 96, 168, 0.3);
  backdrop-filter: blur(5px);
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 2400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-radius: var(--radius);

  &.has-banner {
    top: 54px;
  }
}

.header_logo {
  display: flex;
  align-items: center;
  padding: 0px; 
}

.header_logo_image {
  height: 40px;
  width: auto;
}

.header_nav {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header_menu_icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;

  span {
    display: block;
    width: 100%;
    height: 2px;
    background-color: var(--white);
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  &.is-open {
    span:nth-child(1) {
      transform: rotate(45deg) translate(8px, 8px);
    }

    span:nth-child(2) {
      opacity: 0;
    }

    span:nth-child(3) {
      transform: rotate(-45deg) translate(8px, -8px);
    }
  }
}

// Menu déroulant
.header_menu {
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 1001;

  &.has-banner {
    top: 134px;
  }
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;

  &.is-open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
}

.header_container {
  position: relative;
}

// Overlay pleine page (sous le header)
.header_overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: all 0.3s ease;

  &.is-open {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }
}

.header_menu_nav {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.header_menu_link {
  color: var(--white);
  text-decoration: none;
  font-size: 20px;
  font-family: var(--font-body);
  padding: 16px 32px;
  background-color: rgba(0, 96, 168, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 100px;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover,
  &.router-link-exact-active {
    background-color: var(--beige);
    color: var(--black);
  }
}

// Responsive
@media screen and (max-width: 767px) {
  .header {
    height: 50px;
    top: 10px;
    left: 10px;
    right: 10px;
    width: calc(100% - 20px);
    padding: 0 15px;

    &.has-banner {
      top: 44px;
    }
  }

  .header_logo_image {
    height: 30px;
  }

  .header_menu_icon {
    width: 24px;
    height: 24px;
  }

  .header_menu {
    right: 10px;
    top: 70px;

    &.has-banner {
      top: 104px;
    }
  }

  .header_menu_link {
    font-size: 18px;
    padding: 14px 28px;
  }

  .header_nav .app-button {
    display: none;
  }
}
</style>
