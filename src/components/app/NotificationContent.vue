<script setup lang="ts">
import { AppBskyFeedPost } from '@atproto/api'
import { onMounted, computed, ref } from 'vue'
import { useRichText } from '@/composables/useRichText.ts'
import { useSkySessionStore } from '@/stores/SkySessionStore.ts'

const skySessionStore = useSkySessionStore()
type FeedPostRecord = AppBskyFeedPost.Record

export interface Props {
  record: FeedPostRecord
  type: string
  reasonSubject: string
}

const { render } = useRichText()

const props = withDefaults(defineProps<Props>(), {})

const renderedText = computed(() => {
  if (props.type === 'reply') {
    return render(props.record.text, props.record.facets)
  }
  return null
})

const context = ref()

onMounted(async () => {
  if (props.type === 'like') {
    const posts = await skySessionStore.getPosts([props.reasonSubject])
    context.value = posts[0]?.post.record.text
  }
})

</script>

<template>
  <div class="flex items-1 flex-col">
    <div
      v-if="type==='reply'"
      class="leading-snug text-base text-black text-left py-2 flex-1 flex-wrap break-words hyphens-auto markdown"
      v-html="renderedText"
    />
    <div
      v-if="type==='like'"
      class="leading-snug text-base text-black text-left py-2 flex-1 flex-wrap break-words hyphens-auto markdown"
    >
      {{ context }}
    </div>
  </div>
</template>
