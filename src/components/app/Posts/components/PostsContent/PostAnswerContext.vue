<script setup lang="ts">
import { AppBskyFeedPost, AppBskyFeedDefs, AppBskyActorDefs } from '@atproto/api'
import { useRichText } from '@/composables/useRichText.ts'
import { useElementHover } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import PostOtherAccountAction from './PostOtherAccountAction.vue'

type Reply = AppBskyFeedDefs.ReplyRef
type Author = AppBskyActorDefs.ProfileViewBasic
type FeedPostRecord = AppBskyFeedPost.Record

const router = useRouter()

const { render } = useRichText()

export interface Props {
  reply: Reply
}

const props = defineProps<Props>()

const record = computed<FeedPostRecord>(() => props.reply?.parent?.record as FeedPostRecord)
const renderedText = computed(() => {
  return render(record.value.text, record.value.facets)
})

const getThread = () => {
  const uri = props.reply?.parent?.uri || null
  if (typeof uri === 'string') {
    router.push({
      name: 'thread',
      params: {
        uri: encodeURI(uri)
      }
    })
  }
}

const author = computed(() => props.reply?.parent?.author as Author || null)
const myHoverableElement = ref()
const isExpanded = useElementHover(myHoverableElement, { delayEnter: 1000 })

</script>
<template>
  <div
    class="text-sm leading-snug text-gray-500 text-left my-2 mr-2 break-words flex-1 flex-wrap hyphens-auto border-l-4 pl-2 animate-in slide-in-from-top animate-out slide-out-from-bottom"
    @click="getThread()"
  >
    <PostOtherAccountAction
      :author="author"
      action="Antwort an"
    />
    <span
      ref="myHoverableElement"
      :class="!isExpanded ? 'line-clamp-2' : ''"
      v-html="renderedText"
    />
  </div>
</template>
