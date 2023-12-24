<script setup lang="ts">
import { AppBskyEmbedRecordWithMedia } from '@atproto/api'
import PostRecord from './PostRecord.vue'

export interface Props {
  record: AppBskyEmbedRecordWithMedia.View
}

defineProps<Props>()

</script>

<template>
  <div>
    <PostRecord
      :record="record.record"
      :author="record.record.author"
      :type="record.$type"
      :value="record.record.value"
    />
    <PostEmbed
      :type="record.record.embeds[0].media.$type"
      :embed="record.record.embeds[0].media"
    />
  </div>
</template>
