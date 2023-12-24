<script setup lang="ts">
// AppBskyEmbedRecord, AppBskyEmbedRecordWithMediaA ppBskyEmbedImages, AppBskyEmbedExternal
import { AppBskyFeedPost, AppBskyActorDefs, AppBskyFeedDefs } from '@atproto/api'
import { computed, ref } from 'vue'
import { useBookmarkStore } from '@/stores/BookmarkStore.ts'
import PostEmbedExternal from './PostEmbedExternal.vue'
import PostEmbedImages from './PostEmbedImages.vue'
import PostEmbedRecord from './PostEmbedRecord.vue'
import PostAnswerContext from './PostAnswerContext.vue'
import PostProfileHoverCard from './PostProfileHoverCard.vue'
import PostEmbedRecordWithMedia from './PostEmbedRecordWithMedia.vue'
import PostHeader from './PostHeader.vue'

import PostFooter from './PostFooter.vue'

import { useRouter } from 'vue-router'
import { useRichText } from '@/composables/useRichText.ts'

const bookmarkStore = useBookmarkStore()
type FeedPostRecord = AppBskyFeedPost.Record
type Reply = AppBskyFeedDefs.ReplyRef
type Reason = AppBskyFeedDefs.ReasonRepost
type Author = AppBskyActorDefs.ProfileViewBasic

type PostView = AppBskyFeedDefs.PostView

const router = useRouter()

export interface Props {

}
const avatarIcon = computed(() => {
  if (isRepost.value) {
    return 'message-share'
  }
  if (isReply.value) {
    return 'message-reply'
  }
  return undefined
})

const { render } = useRichText()

const renderText = (record: FeedPostRecord) => {
  return render(record)
}

const props = defineProps<Props>()
const isRepost = computed(() => props.reason?.$type === 'app.bsky.feed.defs#reasonRepost')
const isReply = computed(() => props.reply?.parent?.$type === 'app.bsky.feed.defs#postView')
const indexedAtFormated = computed(() => props.post?.indexedAt)

</script>

<template>
  <div class="flex items-stretch flex-col border-4">
    <div>
      Media
    </div>
  </div>
</template>
