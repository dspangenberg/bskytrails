<script setup lang="ts">
import { AppBskyFeedDefs, AppBskyEmbedRecord, AppBskyActorDefs } from '@atproto/api'
import Post from '@/components/app/Posts/Post.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

type Author = AppBskyActorDefs.ProfileViewBasic
type AuthorDetailed = AppBskyActorDefs.ProfileViewDetailed
type PostView = AppBskyFeedDefs.PostView

export interface Props {
  record: AppBskyEmbedRecord.View
  post?: PostView
}

const props = defineProps<Props>()

const author = computed(() => props.record.author as Author | AuthorDetailed)

const feedParams = (uri: string) => {
  const parts = uri.replace('at://', '').split('/')
  const params = {
    uri: parts[0],
    type: parts[1],
    name: parts[2]
  }
  return params
}

const getThread = () => {
  const uri = props.record.uri || null
  if (uri) {
    const params = feedParams(uri)
    router.push({
      name: 'thread',
      params
    })
  }
}

</script>

<template>
  <div
    class="border rounded-md w-full flex-1 mr-0 pr-0"
    @click="getThread"
  >
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
