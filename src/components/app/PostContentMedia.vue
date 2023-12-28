<script setup lang="ts">
import { AppBskyFeedDefs, AppBskyEmbedRecord, AppBskyEmbedRecordWithMedia, AppBskyEmbedImages, AppBskyEmbedExternal } from '@atproto/api'
import PostEmbed from './PostEmbed.vue'
type PostView = AppBskyFeedDefs.PostView

export interface Props {
  type: string | undefined
  post?: PostView
  embed: AppBskyEmbedRecord.View | AppBskyEmbedRecordWithMedia.View | AppBskyEmbedImages.View | AppBskyEmbedExternal.View | undefined
}

withDefaults(defineProps<Props>(), {
  post: undefined
})

</script>

<template>
  <div class="flex items-stretch flex-col flex-1">
    <div>
      <PostEmbed
        :type="type"
        :post="post"
        :embed="embed"
      />
    </div>
  </div>
</template>
