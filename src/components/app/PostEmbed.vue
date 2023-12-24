<script setup lang="ts">
//
import { AppBskyEmbedRecord, AppBskyEmbedRecordWithMedia, AppBskyEmbedImages, AppBskyEmbedExternal } from '@atproto/api'
import { computed } from 'vue'

import PostEmbedExternal from './PostEmbedExternal.vue'
import PostEmbedImages from './PostEmbedImages.vue'
import PostEmbedRecord from './PostEmbedRecord.vue'
import PostEmbedRecordWithMedia from './PostEmbedRecordWithMedia.vue'

export interface Props {
  type: string | undefined
  embed: AppBskyEmbedRecord | AppBskyEmbedRecordWithMedia | AppBskyEmbedImages | AppBskyEmbedExternal | undefined
}

const props = defineProps<Props>()

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
    class="flex-1 whitespace-break-spaces overflow-x-hidden break-words flex mr-8"
  >
    <component
      :is="embedComponent"
      :external="embed.external"
      :images="embed.images"
      :record="embed.record"
    />
  </div>
</template>
