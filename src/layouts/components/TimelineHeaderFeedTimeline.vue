<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSkyTimelineStore } from '@/stores/SkyTimelineStore.ts'
import { watch } from 'vue'
import { useRoute, type RouteLocationNormalized } from 'vue-router'

const timelineStore = await useSkyTimelineStore()
const { feed } = storeToRefs(timelineStore)
const route = useRoute()

export interface Props {
  title: string | null
}

const createFeedUri = (route: RouteLocationNormalized) => {
  const { uri, type, name } = route.params
  const params = `${uri}/${type}/${name}`

  return params
}

watch(route, async (route) => {
  if (route.name === 'feeds-timeline') {
    const uri = createFeedUri(route)
    await timelineStore.getFeedDetails(uri)
  }
}, { immediate: true })

defineProps<Props>()
</script>

<template>
  <div
    v-if="feed"
    class="flex items-center flex-1 p-4"
  >
    <h1 class="text-xl font-bold flex-1">
      {{ feed.displayName }}
    </h1>
    <div class="flex-none">
      <storm-ui-icon-button
        icon="settings"
        tooltip="Homefeed-Einstellungen"
      />
    </div>
  </div>
</template>
