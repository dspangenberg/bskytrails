<script setup lang="ts">
import { AppBskyEmbedRecord } from '@atproto/api'
import { computed } from 'vue'
import PostRecord from './PostRecord.vue'

export interface Props {
  record: AppBskyEmbedRecord.View
}

const props = defineProps<Props>()

</script>

<template>
  <PostRecord
    :record="record"
    :author="record.author"
    :type="record.$type"
    :value="record.value"
  />
</template>
