<script setup lang="ts">
import { AppBskyFeedPost } from '@atproto/api'
import { onMounted, computed, ref } from 'vue'
import { useRichText } from '@/composables/useRichText.ts'
import { useSkySessionStore } from '@/stores/SkySessionStore.ts'
import { useRouter, useRoute, type RouteLocationNormalized } from 'vue-router'

const router = useRouter()
const route = useRoute()

const skySessionStore = useSkySessionStore()
type FeedPostRecord = AppBskyFeedPost.Record

export interface Props {
  record?: FeedPostRecord
  type: string
  reasonSubject: string
  uri: string
}

const { render } = useRichText()

const props = withDefaults(defineProps<Props>(), {
  record: undefined
})

const renderedText = computed(() => {
  if (props.type === 'reply' && props.record !== undefined) {
    return render(props.record.text, props.record.facets)
  }
  return null
})

const feedParams = (uri: string) => {
  const parts = uri.replace('at://', '').split('/')
  const params = {
    uri: parts[0],
    type: parts[1],
    name: parts[2]
  }
  return params
}
const context = ref()

onMounted(async () => {
  context.value = null
  if (props.type === 'like' || props.type === 'repost') {
    if (props.type === 'repost') console.log(props.record.subject.uri)
    const posts = await skySessionStore.getPosts([props.record.subject.uri])
    if (posts && posts.length > 0) {
      context.value = posts[0]?.post.record.text
      if (props.type === 'repost') console.log(posts, context.value)
    }
  }
})

const getThread = () => {
  const uri = (props.type === 'reply') ? props.uri : props.record.subject.uri
  const params = feedParams(uri)
  router.push({
    name: 'thread',
    params
  })
}

</script>

<template>
  <div
    class="flex items-1 flex-col"
    @click="getThread"
  >
    <div
      v-if="type==='reply'"
      class="leading-snug text-base text-black text-left py-2 flex-1 flex-wrap break-words hyphens-auto markdown"
      v-html="renderedText"
    />
    <div
      v-if="context"
      class="leading-snug text-base text-black text-left py-2 flex-1 flex-wrap break-words hyphens-auto markdown"
    >
      {{ context }}
    </div>
  </div>
</template>
