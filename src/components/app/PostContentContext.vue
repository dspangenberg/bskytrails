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
  <div class="flex items-1 flex-col w-full">
    <div>
      <PostAnswerContext :reply="reply" />
    </div>
  </div>
</template>
