<script setup lang="ts">
import { AppBskyFeedDefs, AppBskyFeedPost, AppBskyActorDefs } from '@atproto/api'
import { useRichText } from '@/composables/useRichText.ts'
import { useElementHover } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

type Reply = AppBskyFeedDefs.ReplyRef
type FeedPostRecord = AppBskyFeedPost.Record
type Author = AppBskyActorDefs.ProfileViewBasic

const router = useRouter()

const { render } = useRichText()
const renderText = (record: FeedPostRecord) => {
  return render(record)
}

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
const isExpanded = useElementHover(myHoverableElement, { delayEnter: 500 })

export interface Props {
  reply: Reply
}

const props = defineProps<Props>()
</script>
<template>
  <div
    class="text-sm leading-snug text-gray-500 text-left my-2 mr-2 break-words flex-1 flex-wrap hyphens-auto border-l-4 pl-2 animate-in slide-in-from-top animate-out slide-out-from-bottom"
    @click="getThread()"
  >
    <span class="font-normal text-stone-400 ">
      Antwort an {{ author?.handle }}</span>
    <span
      ref="myHoverableElement"
      :class="!isExpanded ? 'line-clamp-2' : ''"
      v-html="renderText(reply?.parent?.record as FeedPostRecord)"
    />
  </div>
</template>
