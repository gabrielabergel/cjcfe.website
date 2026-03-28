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
import type { CMS_ImageObject } from '~/types/image'

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
      cover: CMS_ImageObject | null
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
          cover: {
            query: 'page.content.get("cover").toFile',
            select: {
              alt: 'file.alt.value',
              tiny: 'file.resize(50, null, 10)',
              small: 'file.resize(500)',
              reg: 'file.resize(1280)',
              large: 'file.resize(1920)',
              xxl: 'file.resize(2500)',
              focus: 'file.focus',
            },
          },
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
