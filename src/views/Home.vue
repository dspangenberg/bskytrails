<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSkySessionStore } from '@/stores/SkySessionStore.ts'
import { useRoute, type RouteLocationNormalized } from 'vue-router'

import { useSkyTimelineStore } from '@/stores/SkyTimelineStore.ts'
import { useInfiniteScroll, useScroll } from '@vueuse/core'
import Post from '@/components/app/Posts/Post.vue'

const el = ref<HTMLElement | null>(null)

const timelineStore = await useSkyTimelineStore()

const route = useRoute()
const skySessionStore = useSkySessionStore()

const { profile } = storeToRefs(skySessionStore)
const { viewTimeline, isLoading } = storeToRefs(timelineStore)

useInfiniteScroll(
  el,
  async () => {
    if (viewTimeline.value?.cursor) {
      await timelineStore.loadMore(viewTimeline.value.cursor)
    }
  }
)

const { y } = useScroll(el)

const createFeedUri = (route: RouteLocationNormalized) => {
  const { uri, type, name } = route.params
  const params = `${uri}/${type}/${name}`

  return params
}

const actorParam = computed<string>(() => {
  if (route.params?.handle) {
    return route.params.handle.toString()
  }
  return profile.value?.handle.toString() || ''
})

watch(route, async (route) => {
  y.value = 0
  switch (route.name) {
    case 'bookmarks':
      await timelineStore.getTimelineByView('bookmarks')
      break
    case 'profile':
      if (actorParam.value !== undefined) {
        await timelineStore.getTimelineByView('actor', actorParam.value)
      }
      break
    case 'thread':
      await timelineStore.getTimelineByView('thread', createFeedUri(route))
      break
    case 'feeds-timeline':
      await timelineStore.getTimelineByView('feed', createFeedUri(route))
      break
    case 'lists-feed':
      await timelineStore.getTimelineByView('list', createFeedUri(route))
      break
    default:
      await timelineStore.getTimelineByView('timeline', undefined)
      break
  }
}, { immediate: true })

</script>
<template>
  <div class="flex flex-1 h-full items-stretch">
    <ul
      v-if="!isLoading && viewTimeline"
      ref="el"
      class="divide-y px-0 mx-0 h-full flex flex-col flex-1 overflow-y-auto overflow-x-hidden animate-in fade-in duration-150"
    >
      <Post
        v-for="(post, index) in viewTimeline.feed"
        :key="index"
        :author="post.post?.author"
        :post="post.post"
        :reply="post.reply"
        :indexed-at="post.post?.indexedAt"
        :embed="post.post?.embed"
        :embed-type="post.post?.embed?.$type"
        :uri="post.post.uri"
        :reason="post.reason"
        :record="post.post?.record"
      />
    </ul>
    <div
      v-if="isLoading"
      class="flex items-center justify-center min-h-screen w-full flex-1"
    >
      <!-- centered content -->

      <div class="">
        <storm-ui-spinner :size="8" />
      </div>

      <!-- end centered content -->
    </div>
  </div>
</template>
