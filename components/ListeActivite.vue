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
        @click="toggleActivite(index)"
      >
        <div class="list_plus">
          <div class="list_plus_line"></div>
          <div class="list_plus_line is-vertical" v-show="!openActivites[index]"></div>
        </div>
        <div class="list_line_wrapper">
          <div class="list_case">
            <p class="list_label is-bold">{{ activite.titre }}</p>
          </div>
          <div v-if="!openActivites[index]" class="list_case is-mobile-hidden">
            <p class="list_label">{{ activite.description?.substring(0, 50) }}...</p>
          </div>
        </div>
        <div class="list_desc" v-show="openActivites[index]">
          <p class="list_dev_text">{{ activite.description }}</p>
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
</script>

<style lang="scss">
</style>
