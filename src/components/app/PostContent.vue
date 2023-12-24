<script setup lang="ts">
import { AppBskyFeedPost, AppBskyFeedDefs, AppBskyEmbedRecord, AppBskyEmbedRecordWithMedia, AppBskyEmbedImages, AppBskyEmbedExternal } from '@atproto/api'
import PostContentMain from './PostContentMain.vue'
import PostContentContext from './PostContentContext.vue'
import PostContentMedia from './PostContentMedia.vue'
import { computed } from 'vue'

type Reply = AppBskyFeedDefs.ReplyRef

type FeedPostRecord = AppBskyFeedPost.Record

export interface Props {
  type: string
  record: FeedPostRecord
  reply?: Reply
  embedType: string | undefined
  embed: AppBskyEmbedRecord | AppBskyEmbedRecordWithMedia | AppBskyEmbedImages | AppBskyEmbedExternal | undefined
}

const props = defineProps<Props>()

const isReply = computed(() => props.reply?.parent?.$type === 'app.bsky.feed.defs#postView')

</script>

<template>
  <div class="flex items-stretch flex-col">
    <div v-if="isReply">
      <PostContentContext :reply="reply" />
    </div>
    <div>
      <PostContentMain
        :type="record.$type"
        :langs="record.langs"
        :text="record.text"
        :facets="record.facets"
      />
    </div>
    <div>
      <PostContentMedia
        :embed="embed"
        :type="embedType"
      />
    </div>
  </div>
</template>
