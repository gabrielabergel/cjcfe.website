<template>
  <section v-if="activites.length" class="list" id="activites">
    <h2 class="list_title">{{ title }}</h2>
    <div class="list_line--header">
      <div class="list_line_wrapper">
        <div class="list_case">
          <p class="list_label"><strong>Activité</strong></p>
        </div>
        <div class="list_case">
          <p class="list_label"><strong>Description</strong></p>
        </div>
      </div>
    </div>
    <div class="list_wrapper">
      <div
        v-for="(activite, index) in activites"
        :key="index"
        class="list_line"
      >
        <div class="list_plus" @click="toggleActivite(index)">
          <div class="list_plus_line"></div>
          <div class="list_plus_line is-vertical" v-show="!openActivites[index]"></div>
        </div>
        <div class="list_line_wrapper" @click="toggleActivite(index)">
          <div class="list_case">
            <p class="list_label is-bold">{{ activite.titre }}</p>
          </div>
          <div class="list_case">
            <p class="list_label list_activite_desc">
              <template v-if="openActivites[index]">{{ activite.description }}</template>
              <template v-else>{{ preview(activite.description) }}</template>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface Activite {
  titre: string
  description: string
}

const props = defineProps<{
  title?: string
  activites: Activite[]
}>()

// État pour les activités dépliables
const openActivites = reactive<Record<number, boolean>>({})

const toggleActivite = (index: number) => {
  openActivites[index] = !openActivites[index]
}

// Aperçu tronqué de la description quand l'accordéon est fermé
const preview = (description: string) => {
  if (!description) return ''
  return description.length > 50 ? `${description.substring(0, 50)}…` : description
}
</script>

<style lang="scss">
// La description reste dans sa colonne et s'étend en place (pas de bloc qui descend)
.list_activite_desc {
  white-space: pre-line;
}
</style>
