<script setup lang="ts">
import TimelineHeaderDefault from './TimelineHeaderDefault.vue'
import TimelineHeaderBookmarks from './TimelineHeaderBookmarks.vue'
import TimelineHeaderProfile from './TimelineHeaderProfile.vue'
import TimelineHeaderListTimeline from './TimelineHeaderListTimeline.vue'
import TimelineHeaderFeedTimeline from './TimelineHeaderFeedTimeline.vue'
import { useRouter, type RouteRecordName } from 'vue-router'
import { computed } from 'vue'

export interface Props {
  title: string | null
  type: RouteRecordName | null
}

const router = useRouter()
const props = defineProps<Props>()

const onGoBack = () => {
  router.go(-1)
}

const component = computed(() => {
  switch (props.type) {
    case 'bookmarks':
      return TimelineHeaderBookmarks
    case 'profile':
      return TimelineHeaderProfile
    case 'lists-feed':
      return TimelineHeaderListTimeline
    case 'feeds-timeline':
      return TimelineHeaderFeedTimeline
    default:
      return TimelineHeaderDefault
  }
})

</script>

<template>
  <div
    class="border-b bg-white flex items-center min-h-[65px] animate-in fade-in duration-150"
  >
    <div
      v-if="props.type !== 'profile'"
      class="flex-none pl-4 cursor-pointer"
    >
      <storm-ui-icon
        name="arrow-left"
        @click="onGoBack"
      />
    </div>
    <component
      :is="component"
      :title="title"
    />
  </div>
</template>
