<script setup lang="ts">
//
import { AppBskyFeedDefs, AppBskyEmbedRecord, AppBskyEmbedRecordWithMedia, AppBskyEmbedImages, AppBskyEmbedExternal } from '@atproto/api'
import { computed } from 'vue'

import PostEmbedExternal from './PostEmbedExternal.vue'
import PostEmbedImages from './PostEmbedImages.vue'
import PostEmbedRecord from './PostEmbedRecord.vue'
import PostEmbedRecordWithMedia from './PostEmbedRecordWithMedia.vue'
type PostView = AppBskyFeedDefs.PostView

export interface Props {
  post?: PostView
  type: string | undefined
  embed: AppBskyEmbedRecord.View | AppBskyEmbedRecordWithMedia.View | AppBskyEmbedImages.View | AppBskyEmbedExternal.View | undefined
}

const props = withDefaults(defineProps<Props>(), {
  post: undefined
})

const embedComponent = computed(() => {
  switch (props.type) {
    case 'app.bsky.embed.record#view':
      return PostEmbedRecord
    case 'app.bsky.embed.images#view':
      return PostEmbedImages
    case 'app.bsky.embed.external#view':
      return PostEmbedExternal
    case 'app.bsky.embed.recordWithMedia#view':
      return PostEmbedRecordWithMedia
  }
  return null
})

</script>

<template>
  <div
    class="flex-1 whitespace-break-spaces overflow-x-hidden break-words flex"
  >
    <component
      :is="embedComponent"
      v-if="type"
      :post="post"
      :external="embed?.external"
      :images="embed?.images"
      :record="embed?.record"
    />
  </div>
</template>
