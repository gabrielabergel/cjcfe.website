<template>
  <div class="shabbat-banner">
    <div class="shabbat-banner_content">
      <!-- Date du Shabbat -->
      <div class="shabbat-banner_item">
        <span class="shabbat-banner_label">Date</span>
        <span class="shabbat-banner_value">{{ formattedDate }}</span>
      </div>

      <!-- Paracha de la semaine -->
      <div class="shabbat-banner_item">
        <span class="shabbat-banner_label">Paracha</span>
        <span class="shabbat-banner_value">{{ parachaLabel }}</span>
      </div>

      <!-- Horaires Shabbat -->
      <div class="shabbat-banner_item">
        <span class="shabbat-banner_label">Shabbat</span>
        <span class="shabbat-banner_value">
          Ven. {{ formatTime(shabbatDebutHeure) }} - Sam. {{ formatTime(shabbatFinHeure) }}
        </span>
      </div>

      <!-- Horaires offices -->
      <div class="shabbat-banner_item">
        <span class="shabbat-banner_label">Offices</span>
        <span class="shabbat-banner_value">
          <template v-if="vendrediSoir">{{ vendrediSoir }}</template>
          <template v-if="vendrediSoir && samediMatin"> - </template>
          <template v-if="samediMatin">{{ samediMatin }}</template>
        </span>
      </div>

      <!-- Fête juive (si activée) -->
      <template v-if="fetesActiver">
        <div class="shabbat-banner_item shabbat-banner_item--fete">
          <span class="shabbat-banner_label">{{ feteLabel }}</span>
          <span class="shabbat-banner_value">
            {{ formatFeteDate(fetesDebutDate) }} {{ formatTime(fetesDebutHeure) }} -
            {{ formatFeteDate(fetesFinDate) }} {{ formatTime(fetesFinHeure) }}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  shabbatParacha?: string | null
  shabbatDebutDate?: string | null
  shabbatDebutHeure?: string | null
  shabbatFinDate?: string | null
  shabbatFinHeure?: string | null
  vendrediSoir?: string | null
  samediMatin?: string | null
  // Fêtes
  fetesActiver?: boolean
  fetesNom?: string | null
  fetesDebutDate?: string | null
  fetesDebutHeure?: string | null
  fetesFinDate?: string | null
  fetesFinHeure?: string | null
}

const props = defineProps<Props>()

// Mapping des parachot
const parachotLabels: Record<string, string> = {
  'bereshit': 'Bereshit',
  'noah': 'Noah',
  'lekh-lekha': 'Lekh Lekha',
  'vayera': 'Vayera',
  'haye-sarah': 'Hayé Sarah',
  'toledot': 'Toledot',
  'vayetse': 'Vayétsé',
  'vayishlah': 'Vayishlah',
  'vayeshev': 'Vayeshev',
  'mikkets': 'Mikkets',
  'vayigash': 'Vayigash',
  'vayehi': 'Vayehi',
  'shemot': 'Shemot',
  'vaera': 'Vaéra',
  'bo': 'Bo',
  'beshalah': 'Beshalah',
  'yitro': 'Yitro',
  'mishpatim': 'Mishpatim',
  'terouma': 'Terouma',
  'tetsave': 'Tetsavé',
  'ki-tissa': 'Ki Tissa',
  'vayakhel': 'Vayakhel',
  'pekoude': 'Pekoudé',
  'vayikra': 'Vayikra',
  'tsav': 'Tsav',
  'shemini': 'Shemini',
  'tazria': 'Tazria',
  'metsora': 'Metsora',
  'ahare-mot': 'Aharé Mot',
  'kedoshim': 'Kedoshim',
  'emor': 'Emor',
  'behar': 'Behar',
  'behoukotai': 'Behoukotaï',
  'bamidbar': 'Bamidbar',
  'nasso': 'Nasso',
  'behaalotekha': 'Behaalotekha',
  'shelah-lekha': 'Shelah Lekha',
  'korah': 'Korah',
  'houkat': 'Houkat',
  'balak': 'Balak',
  'pinhas': "Pin'has",
  'matot': 'Matot',
  'massei': 'Massé',
  'devarim': 'Devarim',
  'vaethanan': "Vaet'hanan",
  'ekev': 'Ekev',
  'ree': 'Reé',
  'shoftim': 'Shoftim',
  'ki-tetse': 'Ki Tétsé',
  'ki-tavo': 'Ki Tavo',
  'nitsavim': 'Nitsavim',
  'vayelekh': 'Vayélekh',
  'haazinou': 'Haazinou',
  'vezot-haberakha': 'Vezot Haberakha',
}

const fetesLabels: Record<string, string> = {
  'rosh-hashana': 'Roch Hachana',
  'yom-kippour': 'Yom Kippour',
  'souccot': 'Souccot',
  'chemini-atseret': 'Chemini Atseret',
  'simhat-torah': "Sim'hat Torah",
  'hanoukka': 'Hanoukka',
  'tou-bichvat': 'Tou Bichvat',
  'pourim': 'Pourim',
  'pessah': 'Pessah',
  'yom-hashoah': 'Yom HaShoah',
  'yom-haatsmaout': 'Yom HaAtsmaout',
  'lag-baomer': 'Lag BaOmer',
  'chavouot': 'Chavouot',
  'tisha-beav': 'Tisha BeAv',
}

const parachaLabel = computed(() => {
  const key = props.shabbatParacha
  return key ? parachotLabels[key] || key : ''
})

const feteLabel = computed(() => {
  const key = props.fetesNom
  return key ? fetesLabels[key] || key : 'Fête'
})

const formattedDate = computed(() => {
  if (!props.shabbatDebutDate) return ''
  const dateObj = new Date(props.shabbatDebutDate)
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' }
  return dateObj.toLocaleDateString('fr-FR', options)
})

const formatTime = (time: string | null | undefined): string => {
  if (!time) return ''
  const parts = time.split(':')
  if (parts.length >= 2) {
    return `${parts[0]}h${parts[1]}`
  }
  return time
}

const formatFeteDate = (date: string | null | undefined): string => {
  if (!date) return ''
  const dateObj = new Date(date)
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric' }
  return dateObj.toLocaleDateString('fr-FR', options)
}
</script>

<style lang="scss">
.shabbat-banner {
  position: relative;
  background-color: var(--beige);
  width: 100%;
}

.shabbat-banner_content {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
}

.shabbat-banner_item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--20) var(--15);
  border-right: 1px solid rgba(0, 0, 0, 0.1);

  &:last-child {
    border-right: none;
  }

  &--fete {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.shabbat-banner_label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 6px;
}

.shabbat-banner_value {
  font-size: 14px;
  font-weight: 500;
  color: var(--white);
}

@media screen and (max-width: 991px) {
  .shabbat-banner_content {
    flex-wrap: wrap;
  }

  .shabbat-banner_item {
    flex: 1 1 50%;
    min-width: 50%;
    border-right: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    &:nth-child(odd) {
      border-right: 1px solid rgba(0, 0, 0, 0.1);
    }

    &:nth-last-child(-n+2) {
      border-bottom: none;
    }
  }
}

@media screen and (max-width: 479px) {
  .shabbat-banner_item {
    flex: 1 1 100%;
    min-width: 100%;
    padding: var(--15) var(--10);
    border-right: none;

    &:nth-child(odd) {
      border-right: none;
    }
  }

  .shabbat-banner_label {
    font-size: 10px;
  }

  .shabbat-banner_value {
    font-size: 13px;
  }
}
</style>
