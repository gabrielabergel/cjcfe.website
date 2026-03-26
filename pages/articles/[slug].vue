<template>
  <main class="v-article">
    <!-- Header article -->
    <PageHeader
      :titre-text="data?.result?.main_title || data?.result?.title"
      :soustitre-text="data?.result?.resume"
      :date="data?.result?.date"
      variant="transparent"
    />

    <!-- Image cover -->
    <div v-if="data?.result?.cover" class="article_cover">
      <ResponsivePicture
        :image="data.result.cover"
        sizes="(min-width: 2500px) 2500px, 100vw"
        loading="eager"
        picture-class="article_cover_picture"
      />
    </div>

    <!-- Contenu avec layout en colonnes -->
    <div class="article_content">
      <div
        v-for="row in layoutRows"
        :key="row.id"
        class="article_row"
        :class="getRowClass(row)"
      >
        <div
          v-for="column in row.columns"
          :key="column.id"
          class="article_column"
          :class="getColumnClass(column.width)"
        >
          <template v-for="block in getVisibleBlocks(column.blocks)" :key="block.id">
            <BlockTitre
              v-if="block.type === 'heading'"
              :text="block.content?.text"
              :level="block.content?.level"
            />
            <BlockTexte
              v-else-if="block.type === 'text'"
              :text="block.content?.text"
            />
            <BlockImage
              v-else-if="block.type === 'image'"
              :image="block.content?.image"
              :alt="block.content?.alt"
              :caption="block.content?.caption"
            />
            <BlockGalerie
              v-else-if="block.type === 'gallery' && block.content?.images?.length"
              :images="block.content.images"
              :caption="block.content?.caption"
            />
            <BlockCitation
              v-else-if="block.type === 'quote'"
              :text="block.content?.text"
              :citation="block.content?.citation"
            />
            <BlockVideo
              v-else-if="block.type === 'video'"
              :url="block.content?.url"
              :caption="block.content?.caption"
            />
            <BlockLigne
              v-else-if="block.type === 'line' || block.type === 'rule'"
            />
            <BlockListe
              v-else-if="block.type === 'list'"
              :text="block.content?.text"
            />
          </template>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { ResponsiveImage } from '~/types/image'

const route = useRoute()
const slug = route.params.slug as string

type ResolvedBlock = {
  id: string
  type: string
  isHidden?: boolean
  content: {
    text?: string
    level?: string
    image?: ResponsiveImage | null
    images?: ResponsiveImage[]
    caption?: string
    citation?: string
    alt?: string
    url?: string
    [key: string]: unknown
  }
}

type LayoutColumn = {
  id?: string
  width?: string
  blocks?: ResolvedBlock[]
}

type LayoutRow = {
  id?: string
  columns?: LayoutColumn[]
}

type FetchData = CMS_API_Response & {
  result: {
    title: string
    main_title: string | null
    resume: string | null
    date: string | null
    slug: string
    template: string
    layout?: LayoutRow[] | null
    cover?: ResponsiveImage | null
  } | null
}

const { data } = await useFetch<FetchData>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  body: {
    query: `site.find('actualites').children().find('${slug}')`,
    select: {
      title: true,
      main_title: true,
      resume: true,
      date: true,
      slug: true,
      template: true,
      layout: 'page.layoutWithResolvedFiles',
      cover: 'page.responsiveImage("cover", "cover")',
    },
  },
})

const layoutRows = computed((): LayoutRow[] => {
  const layout = data.value?.result?.layout
  if (!layout) return []
  return Array.isArray(layout) ? layout : []
})

function getVisibleBlocks(blocks?: ResolvedBlock[]): ResolvedBlock[] {
  return (blocks ?? []).filter(block => !block.isHidden)
}

function getRowClass(row: LayoutRow): string {
  const columnCount = row.columns?.length || 1
  return `article_row--${columnCount}col`
}

function getColumnClass(width?: string): string {
  const widthMap: Record<string, string> = {
    '1/1': 'article_column--full',
    '1/2': 'article_column--half',
    '1/3': 'article_column--third',
    '2/3': 'article_column--two-thirds',
    '1/4': 'article_column--quarter',
    '3/4': 'article_column--three-quarters',
  }
  return widthMap[width || '1/1'] || 'article_column--full'
}
</script>

<style lang="scss">
.v-article {
  padding-top: 100px;
}

.article_cover {
  width: 100%;
  max-height: 60vh;
  overflow: hidden;

  .article_cover_picture {
    width: 100%;

    img {
      width: 100%;
      height: auto;
      object-fit: cover;
    }
  }
}

.article_content {
  padding: var(--40);
  max-width: 1200px;
  margin: 0 auto;
}

.article_row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--40);
  margin-bottom: var(--40);

  &:last-child {
    margin-bottom: 0;
  }
}

.article_column {
  min-width: 0;

  &--full {
    width: 100%;
  }

  &--half {
    width: calc(50% - var(--20));
  }

  &--third {
    width: calc(33.333% - var(--27));
  }

  &--two-thirds {
    width: calc(66.666% - var(--13));
  }

  &--quarter {
    width: calc(25% - var(--30));
  }

  &--three-quarters {
    width: calc(75% - var(--10));
  }
}

@media (max-width: 768px) {
  .article_content {
    padding: var(--20);
  }

  .article_row {
    gap: var(--20);
  }

  .article_column {
    width: 100% !important;
  }
}
</style>
