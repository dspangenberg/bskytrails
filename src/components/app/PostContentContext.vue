<script setup lang="ts">
import { AppBskyFeedDefs } from '@atproto/api'
import PostAnswerContext from './PostAnswerContext.vue'

type Reply = AppBskyFeedDefs.ReplyRef

export interface Props {
  reply?: Reply
}

defineProps<Props>()

</script>

<template>
  <div class="flex items-stretch flex-col">
    <div>
      <PostAnswerContext :reply="reply" />
    </div>
  </div>
</template>
