<script setup lang="ts">
import { useSkyTimelineStore } from '@/stores/SkyTimelineStore.ts'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

const route = useRoute()
const timelineStore = await useSkyTimelineStore()
const { newTimelinePosts } = storeToRefs(timelineStore)

const onRefreshTimeline = () => {
  timelineStore.refreshTimeline()
}

export interface Props {
  title: string | null
}

defineProps<Props>()

</script>

<template>
  <div class="flex items-center flex-1 p-4">
    <h1 class="text-xl font-bold flex-1">
      {{ title || '&nbsp;' }}
    </h1>
    <div class="flex-none">
      <storm-ui-icon-button
        v-if="route.name === 'home' && newTimelinePosts.length"
        class="animate-bounce"
        icon="refresh"
        variant="outline"
        @click="onRefreshTimeline"
      />
    </div>
  </div>
</template>
