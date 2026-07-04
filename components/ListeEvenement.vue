<template>
  <div class="list" id="agenda">
    <h2 class="list_title">{{ title }}</h2>
    <div class="list_line--header">
      <div class="list_line_wrapper">
        <div class="list_case">
          <p class="list_label"><strong>Dates</strong></p>
        </div>
        <div class="list_case">
          <p class="list_label"><strong>Evénements</strong></p>
        </div>
        <div class="list_case">
          <p class="list_label"><strong>Lieu</strong></p>
        </div>
      </div>
    </div>
    <div class="list_wrapper">
      <div
        v-for="(event, index) in events"
        :key="index"
        class="list_line"
      >
        <div class="list_plus" @click="toggleEvent(index)">
          <div class="list_plus_line"></div>
          <div class="list_plus_line is-vertical" v-show="!openEvents[index]"></div>
        </div>
        <div class="list_line_wrapper" @click="toggleEvent(index)">
          <div class="list_case">
            <p class="list_label">{{ event.date }}</p>
          </div>
          <div class="list_case">
            <p class="list_label is-bold">{{ event.title }}</p>
          </div>
          <div class="list_case">
            <p class="list_label">{{ event.venue }}</p>
          </div>
        </div>
        <div class="list_desc list_desc--event" v-show="openEvents[index]">
          <div v-if="event.description" class="list_dev_text" v-html="event.description"></div>
          <dl
            v-if="event.speaker || event.address || event.participation || event.registration || event.contact || event.link"
            class="event_details"
          >
            <template v-if="event.speaker">
              <dt>Intervenant</dt>
              <dd>{{ event.speaker }}</dd>
            </template>
            <template v-if="event.address">
              <dt>Adresse</dt>
              <dd>{{ event.address }}</dd>
            </template>
            <template v-if="event.participation">
              <dt>Participation</dt>
              <dd>{{ event.participation }}</dd>
            </template>
            <template v-if="event.registration">
              <dt>Inscription</dt>
              <dd>{{ event.registration }}</dd>
            </template>
            <template v-if="event.contact">
              <dt>Contact</dt>
              <dd>{{ event.contact }}</dd>
            </template>
            <template v-if="event.link">
              <dt>Lien</dt>
              <dd><a :href="event.link" target="_blank" rel="noopener noreferrer">{{ event.linkText || 'En savoir plus' }}</a></dd>
            </template>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Agenda'
  },
  events: {
    type: Array,
    default: () => [
      {
        date: 'ex. 17 mars 2025 - 17h',
        title: 'ex. INAUGURATION DE "NOTRE HISTORIA"',
        venue: 'ex. Consulat général du portugal',
        address: 'ex.  Rue du Conseil Général<br>1204 Genève',
        description: 'Description de l’événement.'
      }
    ]
  }
})

const openEvents = reactive({})

// Initialize all events as closed
props.events.forEach((_, index) => {
  openEvents[index] = false
})

const toggleEvent = (index) => {
  openEvents[index] = !openEvents[index]
}
</script>

<style lang="scss">
.event_details {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 8px 16px;
  margin: var(--20) 0 0;
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.5;

  dt {
    color: var(--blue);
    font-weight: 600;
  }

  dd {
    margin: 0;
  }

  a {
    color: var(--blue);
    text-decoration: underline;
  }
}

@media screen and (max-width: 479px) {
  .event_details {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
