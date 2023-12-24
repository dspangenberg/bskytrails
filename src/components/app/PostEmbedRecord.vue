<script setup lang="ts">
import { AppBskyEmbedRecord } from '@atproto/api'
import PostRecord from './PostRecord.vue'

export interface Props {
  record: AppBskyEmbedRecord.View
}

defineProps<Props>()

</script>

<template>
  <div>AppBskyEmbedRecord</div>
</template>
