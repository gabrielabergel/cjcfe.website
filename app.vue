<template>
  <div class="app-wrapper">
    <Transition name="loader-fade" @after-leave="loaderGone = true">
      <div v-if="showLoader" class="app-loader">
        <svg class="app-loader_logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 229.56 156.92" role="img" aria-label="CJCFE - ACI Clermont-Ferrand">
          <g class="app-loader_white" fill="#fff">
            <text class="app-loader_txt" transform="translate(20.69 124.77) scale(1.01 1)"><tspan x="0" y="0">Communauté Juive</tspan></text>
            <text class="app-loader_txt" transform="translate(13.83 151.21) scale(1.01 1)"><tspan x="0" y="0">de Clermont-Ferrand</tspan></text>
            <path d="M34.21,10.23h0v76.62C15.74,81.36,1.51,67.77.13,51.43c-.08-.92-.13-1.86-.13-2.8s.05-1.88.13-2.8C1.51,29.46,15.69,15.72,34.21,10.23"/>
            <path d="M127.31,10.23h0v76.62c-18.47-5.5-32.71-19.08-34.09-35.42-.08-.92-.13-1.86-.13-2.8s.05-1.88.13-2.8c1.38-16.37,15.57-30.11,34.09-35.6"/>
            <polygon points="177.54 10.23 177.54 48.63 159.45 48.63 159.45 86.86 139.63 86.86 139.63 10.23 177.54 10.23"/>
            <polygon points="226.56 29.34 226.56 67.75 206.74 67.75 206.74 86.86 186.93 86.86 186.93 10.23 206.74 10.23 206.74 29.34 226.56 29.34"/>
          </g>
          <g class="app-loader_gold" fill="#bda05e">
            <path d="M80.7,0v40.93c0,.08-.02.15-.02.23-1.41,16.33-15.19,29.95-34.09,35.46V0h34.1Z"/>
            <path d="M93.09,78.1c0-4.84-3.92-8.76-8.76-8.76s-8.76,3.92-8.76,8.76,3.92,8.76,8.76,8.76,8.76-3.92,8.76-8.76"/>
          </g>
        </svg>
      </div>
    </Transition>
    <MarqueeBanner :text="bandeauText" :link="bandeauLink" />
    <AppHeader />
    <ShabbatBanner
      v-if="horairesData"
      :shabbat-paracha="horairesData.shabbatParacha"
      :shabbat-paracha-he="horairesData.shabbatParachaHe"
      :shabbat-debut-date="horairesData.shabbatDebutDate"
      :shabbat-debut-heure="horairesData.shabbatDebutHeure"
      :shabbat-fin-date="horairesData.shabbatFinDate"
      :shabbat-fin-heure="horairesData.shabbatFinHeure"
      :vendredi-soir="horairesData.vendrediSoir"
      :samedi-matin="horairesData.samediMatin"
      :fetes-activer="horairesData.fetesActiver"
      :fetes-nom="horairesData.fetesNom"
      :fetes-debut-date="horairesData.fetesDebutDate"
      :fetes-debut-heure="horairesData.fetesDebutHeure"
      :fetes-fin-date="horairesData.fetesFinDate"
      :fetes-fin-heure="horairesData.fetesFinHeure"
      class="app-shabbat-banner"
    />
    <main class="app-main">
      <NuxtPage/>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// Loader initial : logo sur fond bleu au premier chargement, puis fondu
const showLoader = ref(true)
const loaderGone = ref(false)

onMounted(() => {
  // Laisse le logo visible un court instant avant le fondu
  setTimeout(() => {
    showLoader.value = false
  }, 1800)
})

// Fetch du bandeau défilant et des horaires des offices (CMS)
type AppData = CMS_API_Response & {
  result: {
    bandeau: {
      bandeau: string | null
      bandeau_lien: { slug: string } | null
    }
    infos: {
      vendredi_soir: string | null
      samedi_matin: string | null
    }
  }
}

const { data: appData } = await useFetch<AppData>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  body: {
    query: 'site',
    select: {
      bandeau: {
        query: "site.find('home')",
        select: {
          bandeau: true,
          bandeau_lien: {
            query: 'page.bandeau_lien.toPage',
            select: {
              slug: 'page.uri',
            },
          },
        },
      },
      infos: {
        query: "site.find('infos-pratiques')",
        select: {
          vendredi_soir: true,
          samedi_matin: true,
        },
      },
    },
  },
})

// Horaires de Shabbat automatiques (paracha, bougies, havdalah) via Hebcal
const { data: shabbatData } = await useFetch('/api/shabbat', { lazy: true })

const bandeauText = computed(() => appData.value?.result?.bandeau?.bandeau || null)
const bandeauLink = computed(() => {
  const slug = appData.value?.result?.bandeau?.bandeau_lien?.slug
  return slug ? `/${slug}` : null
})

const horairesData = computed(() => {
  const shabbat = shabbatData.value
  const infos = appData.value?.result?.infos
  if (!shabbat && !infos) return null
  return {
    // Shabbat : automatique via Hebcal (paracha, bougies, havdalah)
    shabbatParacha: shabbat?.shabbatParacha ?? null,
    shabbatParachaHe: shabbat?.shabbatParachaHe ?? null,
    shabbatDebutDate: shabbat?.shabbatDebutDate ?? null,
    shabbatDebutHeure: shabbat?.shabbatDebutHeure ?? null,
    shabbatFinDate: shabbat?.shabbatFinDate ?? null,
    shabbatFinHeure: shabbat?.shabbatFinHeure ?? null,
    // Offices : saisis dans le CMS (spécifiques à la communauté)
    vendrediSoir: infos?.vendredi_soir ?? null,
    samediMatin: infos?.samedi_matin ?? null,
    // Fêtes : automatique via Hebcal (activé quand une fête approche)
    fetesActiver: shabbat?.fetesActiver ?? false,
    fetesNom: shabbat?.fetesNom ?? null,
    fetesDebutDate: shabbat?.fetesDebutDate ?? null,
    fetesDebutHeure: shabbat?.fetesDebutHeure ?? null,
    fetesFinDate: shabbat?.fetesFinDate ?? null,
    fetesFinHeure: shabbat?.fetesFinHeure ?? null,
  }
})
</script>

<style lang="scss">
.app-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: var(--blue);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.app-loader_logo {
  width: clamp(180px, 40vw, 320px);
  height: auto;
}

// Logo plus grand sur mobile
@media screen and (max-width: 767px) {
  .app-loader_logo {
    width: min(78vw, 360px);
  }
}

.app-loader_txt {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 22.04px;
}

// 1) Les parties blanches apparaissent en fondu
.app-loader_white {
  animation: app-loader-fade-in 0.5s ease both;
}

// 2) Juste après, les parties or descendent depuis le haut et se posent
.app-loader_gold {
  animation: app-loader-gold-drop 0.7s cubic-bezier(0.34, 1.45, 0.6, 1) 0.28s both;
}

@keyframes app-loader-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes app-loader-gold-drop {
  from {
    opacity: 0;
    transform: translateY(-22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loader-fade-leave-active {
  transition: opacity 0.6s ease;
}

.loader-fade-leave-to {
  opacity: 0;
}

.app-shabbat-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 998;
}
</style>
