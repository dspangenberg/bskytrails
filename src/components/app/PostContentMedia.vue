<script setup lang="ts">
import { AppBskyEmbedRecord, AppBskyEmbedRecordWithMedia, AppBskyEmbedImages, AppBskyEmbedExternal } from '@atproto/api'
import PostEmbed from './PostEmbed.vue'

export interface Props {
  type: string | undefined
  embed: AppBskyEmbedRecord | AppBskyEmbedRecordWithMedia | AppBskyEmbedImages | AppBskyEmbedExternal | undefined
}

defineProps<Props>()

</script>

<template>
  <div class="flex items-stretch flex-col">
    <div>
      <PostEmbed
        :type="type"
        :embed="embed"
      />
    </div>
  </div>
</template>
