<template>
  <div class="app-wrapper">
    <Transition name="loader-fade" @after-leave="loaderGone = true">
      <div v-if="showLoader" class="app-loader"></div>
    </Transition>
    <MarqueeBanner :text="bandeauText" :link="bandeauLink" />
    <AppHeader />
    <ShabbatBanner
      v-if="horairesData"
      :shabbat-paracha="horairesData.shabbatParacha"
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
// Loader initial : fondu blanc au premier chargement
const showLoader = ref(true)
const loaderGone = ref(false)

onMounted(() => {
  // Petit délai pour laisser le premier paint se faire, puis fondu
  requestAnimationFrame(() => {
    showLoader.value = false
  })
})

// Fetch du bandeau défilant et des horaires Shabbat
type AppData = CMS_API_Response & {
  result: {
    bandeau: {
      bandeau: string | null
      bandeau_lien: { slug: string } | null
    }
    infos: {
      shabbat_paracha: string | null
      shabbat_debut_date: string | null
      shabbat_debut_heure: string | null
      shabbat_fin_date: string | null
      shabbat_fin_heure: string | null
      vendredi_soir: string | null
      samedi_matin: string | null
      fetes_activer: boolean | string
      fetes_nom: string | null
      fetes_debut_date: string | null
      fetes_debut_heure: string | null
      fetes_fin_date: string | null
      fetes_fin_heure: string | null
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
          shabbat_paracha: true,
          shabbat_debut_date: true,
          shabbat_debut_heure: true,
          shabbat_fin_date: true,
          shabbat_fin_heure: true,
          vendredi_soir: true,
          samedi_matin: true,
          fetes_activer: true,
          fetes_nom: true,
          fetes_debut_date: true,
          fetes_debut_heure: true,
          fetes_fin_date: true,
          fetes_fin_heure: true,
        },
      },
    },
  },
})

const bandeauText = computed(() => appData.value?.result?.bandeau?.bandeau || null)
const bandeauLink = computed(() => {
  const slug = appData.value?.result?.bandeau?.bandeau_lien?.slug
  return slug ? `/${slug}` : null
})

const horairesData = computed(() => {
  const infos = appData.value?.result?.infos
  if (!infos) return null
  return {
    shabbatParacha: infos.shabbat_paracha,
    shabbatDebutDate: infos.shabbat_debut_date,
    shabbatDebutHeure: infos.shabbat_debut_heure,
    shabbatFinDate: infos.shabbat_fin_date,
    shabbatFinHeure: infos.shabbat_fin_heure,
    vendrediSoir: infos.vendredi_soir,
    samediMatin: infos.samedi_matin,
    fetesActiver: infos.fetes_activer === true || infos.fetes_activer === 'true',
    fetesNom: infos.fetes_nom,
    fetesDebutDate: infos.fetes_debut_date,
    fetesDebutHeure: infos.fetes_debut_heure,
    fetesFinDate: infos.fetes_fin_date,
    fetesFinHeure: infos.fetes_fin_heure,
  }
})
</script>

<style lang="scss">
.app-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: var(--white, #fff);
  pointer-events: none;
}

.loader-fade-leave-active {
  transition: opacity 0.7s ease;
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
