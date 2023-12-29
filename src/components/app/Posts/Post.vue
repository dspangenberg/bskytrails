<script setup lang="ts">
import { AppBskyActorDefs, AppBskyFeedPost, AppBskyFeedDefs, AppBskyEmbedRecord, AppBskyEmbedRecordWithMedia, AppBskyEmbedImages, AppBskyEmbedExternal } from '@atproto/api'
import { computed } from 'vue'
import PostContent from './components/PostsContent/PostContent.vue'
import ListViewItem from '@/components/app/ListViewItem.vue'
import PostProfileHoverCard from './PostProfileHoverCard.vue'
import PostFooter from './components/PostsContent/PostFooter.vue'
import PostOtherAccountAction from './components/PostsContent/PostOtherAccountAction.vue'

import { useRouter } from 'vue-router'

type FeedPostRecord = AppBskyFeedPost.Record
type Reply = AppBskyFeedDefs.ReplyRef
type Reason = AppBskyFeedDefs.ReasonRepost

type Author = AppBskyActorDefs.ProfileViewBasic
type AuthorDetailed = AppBskyActorDefs.ProfileViewDetailed
type PostView = AppBskyFeedDefs.PostView

const router = useRouter()

export interface Props {
  isEmbeded?: boolean
  author: Author | AuthorDetailed | undefined
  uri: string
  indexedAt: string
  reason?: Reason
  embedType?: string | undefined
  reply?: Reply
  embed?: AppBskyEmbedRecord.View | AppBskyEmbedRecordWithMedia.View | AppBskyEmbedImages.View | AppBskyEmbedExternal.View | undefined
  post?: PostView
  record: FeedPostRecord
  type?: string
}

const props = withDefaults(defineProps<Props>(), {
  isEmbeded: false,
  embedType: undefined,
  reason: undefined,
  reply: undefined,
  post: undefined,
  embed: undefined,
  type: undefined
})

const isRepost = computed(() => props.reason?.$type === 'app.bsky.feed.defs#reasonRepost')
const isReply = computed(() => props.reply?.parent?.$type === 'app.bsky.feed.defs#postView')

const avatarIcon = computed(() => {
  if (isRepost.value) {
    return 'message-share'
  }
  if (isReply.value) {
    return 'message-reply'
  }
  return undefined
})

const goProfile = (handle: string) => {
  router.push({
    name: 'profile',
    params: {
      handle
    }
  })
}

</script>

<template>
  <ListViewItem :embeded="isEmbeded">
    <template #header>
      <PostOtherAccountAction
        v-if="isRepost"
        :author="reason?.by"
      />
    </template>
    <template #avatar>
      <PostProfileHoverCard
        :actor="author"
      >
        <storm-ui-avatar
          v-if="author"
          class="cursor-pointer mx-auto"
          :src="author.avatar"
          :alt="author.handle"
          :size="isEmbeded ? 10 : 12"
          :icon="avatarIcon"
          @click="goProfile(author.handle)"
        />
      </PostProfileHoverCard>
    </template>
    <template #title>
      <div
        v-if="author"
        class="text-base text-black font-medium leading-normal flex-1 flex truncate"
      >
        {{ author.displayName || author.handle }}
      </div>
      <div
        class="flex flex-1 items-center leading-1"
      >
        <div
          v-if="author?.displayName "
          class="flex-1 text-sm text-gray-500"
        >
          {{ author.handle }}
        </div>
      </div>
    </template>
    <template #title-right>
      <storm-ui-time-ago
        v-tooltip="indexedAt"
        :class="isEmbeded ? 'text-xs' : 'text-sm'"
        :date="indexedAt"
      />
    </template>
    <template #content>
      <PostContent
        :is-embeded="isEmbeded"
        :record="record"
        :reply="reply"
        :type="type"
        :post="post"
        :embed="embed"
        :embed-type="embedType"
      />
    </template>
    <template #footer>
      <template v-if="!isEmbeded">
        <PostFooter
          :post="post"
          :reason="reason"
          :record="record"
          :author="author"
          :reply="reply"
        />
      </template>
    </template>
  </ListViewItem>
</template>
