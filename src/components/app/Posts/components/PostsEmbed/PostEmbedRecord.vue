<script setup lang="ts">
import { AppBskyFeedDefs, AppBskyEmbedRecord, AppBskyActorDefs } from '@atproto/api'
import Post from '@/components/app/Posts/Post.vue'
import { computed } from 'vue'

type Author = AppBskyActorDefs.ProfileViewBasic
type AuthorDetailed = AppBskyActorDefs.ProfileViewDetailed
type PostView = AppBskyFeedDefs.PostView

export interface Props {
  record: AppBskyEmbedRecord.View
  post?: PostView
}

const props = defineProps<Props>()

const author = computed(() => props.record?.value?.author as Author | AuthorDetailed)

</script>

<template>
  <div class="border rounded-md w-full flex-1 mr-0 pr-0">
    <Post
      :is-embeded="true"
      :author="author"
      :indexed-at="record.indexedAt"
      :post="post"
      :type="record?.$type"
      :uri="record.uri"
      :record="record.value"
    />
  </div>
</template>
