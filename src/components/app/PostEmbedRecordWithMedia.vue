<script setup lang="ts">
import { AppBskyEmbedRecordWithMedia } from '@atproto/api'

export interface Props {
  record: AppBskyEmbedRecordWithMedia.View
}

defineProps<Props>()

</script>

<template>
  <div>
    <div>AppBskyEmbedRecordWithMedia</div>
  </div>
</template>
