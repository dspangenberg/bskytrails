<script setup lang="ts">
import { AppBskyFeedDefs, AppBskyEmbedRecord } from '@atproto/api'

type PostView = AppBskyFeedDefs.PostView

export interface Props {
  record: AppBskyEmbedRecord.View
  post?: PostView
}

defineProps<Props>()

</script>

<template>
  <div class="border rounded-md w-full flex-1 mr-0 pr-0">
    <app-post
      :is-embeded="true"
      :author="record.author"
      :indexed-at="record.indexedAt"
      :post="post"
      :type="record?.$type"
      :uri="record.uri"
      :record="record.value"
    />
  </div>
</template>
