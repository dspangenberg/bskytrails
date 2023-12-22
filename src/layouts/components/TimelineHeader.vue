<script setup lang="ts">
import TimelineHeaderDefault from './TimelineHeaderDefault.vue'
import TimelineHeaderBookmarks from './TimelineHeaderBookmarks.vue'
import TimelineHeaderProfile from './TimelineHeaderProfile.vue'
import TimelineHeaderFeedTimeline from './TimelineHeaderFeedTimeline.vue'
import { type RouteRecordName } from 'vue-router'
import { computed } from 'vue'

export interface Props {
  title: string | null
  type: RouteRecordName | null
}

const props = defineProps<Props>()

const component = computed(() => {
  switch (props.type) {
    case 'bookmarks':
      return TimelineHeaderBookmarks
    case 'profile':
      return TimelineHeaderProfile
    case 'feeds-timeline':
      return TimelineHeaderFeedTimeline
    default:
      return TimelineHeaderDefault
  }
})

</script>

<template>
  <Suspense>
    <div
      class="border-b bg-white flex items-center"
    >
      <component
        :is="component"
        :title="title"
      />
    </div>
    <template #fallback>
      <div
        class="flex items-center justify-center  flex-1"
      >
        <storm-ui-spinner
          :size="12"
        />
      </div>
    </template>
  </Suspense>
</template>
