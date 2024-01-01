<script setup lang="ts">
import { AppBskyFeedPost, AppBskyFeedDefs, AppBskyEmbedRecord, AppBskyEmbedRecordWithMedia, AppBskyEmbedImages, AppBskyEmbedExternal } from '@atproto/api'
import PostContentMain from './PostContentMain.vue'
import PostContentContext from './PostContentContext.vue'
import PostContentMedia from './PostContentMedia.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
type Reply = AppBskyFeedDefs.ReplyRef

type FeedPostRecord = AppBskyFeedPost.Record
type PostView = AppBskyFeedDefs.PostView

export interface Props {
  record: FeedPostRecord
  reply?: Reply
  isEmbeded?: boolean
  post?: PostView
  type?: string
  embedType: string | undefined
  embed: AppBskyEmbedRecord.View | AppBskyEmbedRecordWithMedia.View | AppBskyEmbedImages.View | AppBskyEmbedExternal.View | undefined
}

const props = withDefaults(defineProps<Props>(), {
  embeded: false,
  post: undefined,
  reply: undefined,
  type: undefined
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

const getThread = () => {
  const uri = props.post?.uri || null
  if (uri) {
    const params = feedParams(uri)
    router.push({
      name: 'thread',
      params
    })
  }
}

const isReply = computed(() => props.reply?.parent?.$type === 'app.bsky.feed.defs#postView')

</script>

<template>
  <div class="flex items-1 flex-col">
    <div v-if="isReply">
      <PostContentContext :reply="reply" />
    </div>
    <div v-if="record">
      <PostContentMain
        :langs="record.langs"
        :text="record.text"
        :facets="record.facets"
        @click="getThread"
      />
    </div>
    <div>
      <PostContentMedia
        :post="post"
        :embed="embed"
        :type="embedType"
      />
    </div>
  </div>
</template>
