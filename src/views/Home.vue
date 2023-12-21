<script setup lang="ts">
import { watch } from 'vue'

import { storeToRefs } from 'pinia'
import { useSkySessionStore } from '@/stores/SkySessionStore.ts'
import { useRoute, type RouteLocationNormalized } from 'vue-router'
import { useBookmarkStore } from '@/stores/BookmarkStore.ts'
import { useSkyTimelineStore } from '@/stores/SkyTimelineStore.ts'
import { usePermission } from '@vueuse/core'

const notifications = usePermission('notifications')
console.log(notifications)


const bookmarkStore = useBookmarkStore()
const timelineStore = await useSkyTimelineStore()

const route = useRoute()
const skySessionStore = useSkySessionStore()

const { profile } = storeToRefs(skySessionStore)
const { viewTimeline, isLoading } = storeToRefs(timelineStore)

const createFeedUri = (route: RouteLocationNormalized) => {
  const { uri, type, name } = route.params
  const params = `${uri}/${type}/${name}`

  return params
}

watch(route, async (route) => {
  switch (route.name) {
    case 'bookmarks':
      await bookmarkStore.getBookmarkedPosts()
      break
    case 'profile':
      await timelineStore.getTimelineByView('actor', route.params?.handle || profile.value?.handle)
      break
    case 'thread':
      await timelineStore.getTimelineByView('thread', route.params?.uri)
      break
    case 'feeds-timeline':
      await timelineStore.getTimelineByView('feed', createFeedUri(route))
      break
    case 'list-feed':
      await timelineStore.getTimelineByView('list', createFeedUri(route))
      break
    default:
      await timelineStore.getTimelineByView('timeline', undefined)
      break
  }
}, { immediate: true })

</script>
<template>
  <div class="flex flex-1 h-full">
    <ul
      v-if="!isLoading && viewTimeline"
      class="divide-y px-0 mx-0 h-full flex flex-col flex-1"
    >
      <app-post
        v-for="(post, index) in viewTimeline.feed"
        :key="index"
        :author="post.post?.author"
        :post="post.post"
        :reply="post.reply"
        :reason="post.reason"
        :record="post.post?.record"
      />
    </ul>
    <div
      v-else
      class="flex items-center justify-center  flex-1"
    >
      <storm-ui-spinner
        :size="12"
      />
    </div>
  </div>
</template>
