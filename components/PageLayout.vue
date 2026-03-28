<template>
  <section v-if="layout?.length" class="page-layout">
    <div v-for="row in layout" :key="row.id" class="layout_row">
      <div
        v-for="column in row.columns"
        :key="column.id"
        class="layout_column"
        :class="getColumnClass(column.width)"
      >
        <AppBlocks :blocks="column.blocks" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
type LayoutColumn = {
  id: string
  width: string
  blocks: CMS_API_Block[]
}

type LayoutRow = {
  id: string
  attrs: any[]
  columns: LayoutColumn[]
}

defineProps<{
  layout?: LayoutRow[] | null
}>()

const getColumnClass = (width: string): string => {
  const widthMap: Record<string, string> = {
    '1/1': 'layout_column--full',
    '1/2': 'layout_column--half',
    '1/3': 'layout_column--third',
    '2/3': 'layout_column--two-thirds',
    '1/4': 'layout_column--quarter',
    '3/4': 'layout_column--three-quarters',
  }
  return widthMap[width] || 'layout_column--full'
}
</script>

<style lang="scss">
$gap: 40px;

.page-layout {
  padding: var(--40);
}

.layout_row {
  display: flex;
  flex-wrap: wrap;
  gap: $gap;
  margin-bottom: 60px;

  &:last-child {
    margin-bottom: 0;
  }
}

.layout_column {
  min-width: 0;

  &--full {
    width: 100%;
  }

  &--half {
    width: calc(50% - #{$gap / 2});
  }

  &--third {
    width: calc(33.333% - #{$gap * 2 / 3});
  }

  &--two-thirds {
    width: calc(66.666% - #{$gap / 3});
  }

  &--quarter {
    width: calc(25% - #{$gap * 3 / 4});
  }

  &--three-quarters {
    width: calc(75% - #{$gap / 4});
  }

  @media (max-width: 768px) {
    width: 100% !important;
  }
}

@media (max-width: 479px) {
  .page-layout {
    padding: 20px;

    .block-image {
      margin: 10px 0;
    }

    .block-texte {
      margin-bottom: 10px;
    }

    .block-titre {
      margin-bottom: 10px;
    }
  }

  .layout_row {
    gap: 10px;
    margin-bottom: 20px;
  }

  .layout_column {
    p {
      font-size: 14px;
    }

    .block-titre--h2 {
      font-size: 45px;
    }

    // Images en dessous des textes sur mobile
    &:has(.block-image) {
      order: 2;
    }

    &:has(.block-texte),
    &:has(.block-titre) {
      order: 1;
    }
  }
}
</style>
