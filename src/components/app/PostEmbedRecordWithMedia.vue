<script setup lang="ts">
import { AppBskyEmbedRecordWithMedia, AppBskyFeedDefs } from '@atproto/api'
type PostView = AppBskyFeedDefs.PostView

export interface Props {
  record: AppBskyEmbedRecordWithMedia.View
  post?: PostView
}

withDefaults(defineProps<Props>(), {
  post: undefined
})

</script>

<template>
  <div>
    <app-post-embed-images :images="post?.embed?.media?.images" />
    <div class="border rounded-md w-full flex-1 mr-0 pr-0">
      <app-post
        :is-embeded="true"
        :author="record.record.author"
        :indexed-at="record.indexedAt"
        :post="record.record"
        :uri="record.record.uri"
        :type="record?.record?.$type"
        :record="record.record.embeds[0].record.record.value"
        :embed="record.record.embeds[0].media"
        :embed-type="record.record.embeds[0].media.$type"
      />
    </div>
  </div>
</template>
