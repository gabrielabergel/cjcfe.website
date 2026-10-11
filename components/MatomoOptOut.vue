<template>
  <div class="list_line matomo-opt-out">
    <div class="list_line_wrapper">
      <div class="list_case">
        <p class="list_label"><strong>Statistiques de visite</strong></p>
      </div>
      <div class="list_case">
        <div id="matomo-opt-out" class="list_label"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Formulaire de désinscription Matomo (opt-out).
// Le script est injecté côté client à chaque affichage de la page,
// car un <script> dans le template ou dans le CMS ne s'exécute pas avec Nuxt.
const SCRIPT_SRC =
  'https://matomo.cjcfe.fr/index.php?module=CoreAdminHome&action=optOutJS&divId=matomo-opt-out&language=auto&showIntro=1'

let script: HTMLScriptElement | null = null

onMounted(() => {
  script = document.createElement('script')
  script.src = SCRIPT_SRC
  script.async = true
  document.body.appendChild(script)
})

onBeforeUnmount(() => {
  script?.remove()
})
</script>
