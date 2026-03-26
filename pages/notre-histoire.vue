<template>
  <main class="page">
    <PageHero
      :titre="data?.result?.page?.titre"
      :soustitre="data?.result?.page?.soustitre"
      :cover="data?.result?.page?.cover"
    />

    <PageLayout :layout="data?.result?.page?.layout" />
  </main>
</template>

<script setup lang="ts">
import type { ResponsiveImage } from '~/types/image'

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

type FetchData = CMS_API_Response & {
  result: {
    page: {
      title: string
      slug: string
      titre: CMS_API_Block[]
      soustitre: CMS_API_Block[]
      cover: ResponsiveImage | null
      layout: LayoutRow[] | null
    }
  }
}

const { data } = await useFetch<FetchData>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  body: {
    query: 'site',
    select: {
      page: {
        query: "site.find('notre-histoire')",
        select: {
          title: true,
          slug: true,
          titre: 'page.titre.toBlocks',
          soustitre: 'page.soustitre.toBlocks',
          cover: 'page.responsiveImage("cover", "cover")',
          layout: 'page.layoutsWithImages("layout", "column")',
        },
      },
    },
  },
})
</script>

<style lang="scss" scoped>
.page {
  padding-top: 0;
}
</style>
