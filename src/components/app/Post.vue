<script setup lang="ts">
import { AppBskyFeedPost, AppBskyActorDefs, AppBskyFeedDefs } from '@atproto/api'
import { computed } from 'vue'
import PostContent from './PostContent.vue'
import ListViewItem from './ListViewItem.vue'
import PostProfileHoverCard from './PostProfileHoverCard.vue'
import PostFooter from './PostFooter.vue'
import PostOtherAccountAction from './PostOtherAccountAction.vue'

import { useRouter } from 'vue-router'

type FeedPostRecord = AppBskyFeedPost.Record
type Reply = AppBskyFeedDefs.ReplyRef
type Reason = AppBskyFeedDefs.ReasonRepost

type Author = AppBskyActorDefs.ProfileViewBasic
type AuthorDetailed = AppBskyActorDefs.ProfileViewDetailed
type PostView = AppBskyFeedDefs.PostView

const router = useRouter()

export interface Props {
  author: Author | AuthorDetailed
  uri: string
  indexedAt: string
  reason?: Reason
  reply?: Reply
  post?: PostView
  record: FeedPostRecord
}

const props = withDefaults(defineProps<Props>(), {
  embeded: false,
  reason: undefined,
  reply: undefined,
  post: undefined
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
  <ListViewItem :embeded="false">
    <template #header>
      <PostOtherAccountAction
        v-if="isRepost"
        :author="reason.by"
      />
    </template>
    <template #avatar>
      <PostProfileHoverCard
        :actor="author"
      >
        <storm-ui-avatar
          class="cursor-pointer mx-auto"
          :src="author.avatar"
          :alt="author.handle"
          :size="12"
          :icon="avatarIcon"
          @click="goProfile(author.handle)"
        />
      </PostProfileHoverCard>
    </template>
    <template #title>
      <div
        class="text-base text-black font-medium leading-normal flex-1 flex truncate"
      >
        {{ author.displayName || author.handle }}
      </div>
      <div
        class="flex flex-1 items-center leading-1"
      >
        <div
          v-if="author.displayName "
          class="flex-1 text-sm text-gray-500"
        >
          {{ author.handle }}
        </div>
      </div>
    </template>
    <template #title-right>
      <storm-ui-time-ago
        v-tooltip="indexedAt"
        :date="indexedAt"
      />
    </template>
    <template #content>
      <PostContent
        :record="record"
        :reply="reply"
        :type="record.$type"
        :embed="post.embed"
        :embed-type="post.embed?.$type"
      />
    </template>
    <template #footer>
      <PostFooter
        :post="post"
        :reason="reason"
        :record="record"
        :author="author"
        :reply="reply"
      />
    </template>
  </ListViewItem>
</template>
