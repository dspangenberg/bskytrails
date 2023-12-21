<script setup lang="ts">
import { AppBskyFeedPost, AppBskyActorDefs, AppBskyFeedDefs } from '@atproto/api'
import { useSkySessionStore } from '@/stores/SkySessionStore.ts'
import { useSkyTimelineStore } from '@/stores/SkyTimelineStore.ts'
import { computed } from 'vue'

const skySessionStore = useSkySessionStore()
const skyTimelineStore = useSkyTimelineStore()

type FeedPostRecord = AppBskyFeedPost.Record
type FeedPost = AppBskyFeedDefs.FeedViewPost
type Reply = AppBskyFeedDefs.ReplyRef
type Reason = AppBskyFeedDefs.ReasonRepost
type Author = AppBskyActorDefs.ProfileViewBasic

export interface Props {
  post: FeedPost
  record: FeedPostRecord
  author: Author
  reason?: Reason
  reply?: Reply
}

const props = defineProps<Props>()

const onLikePost = async () => {
  await skyTimelineStore.postToggleLike(props.post)
}

const onRepost = async () => {
  await skyTimelineStore.postToggleRepost(props.post)
}

const isRepost = computed(() => !!props.post.viewer?.repost)

const onDump = () => {
  const dump = {
    post: props.post,
    reply: props.reply,
    reason: props.reason
  }

  console.log(dump)
}
</script>

<template>
  <div class="gap-x-6 mt-2 flex-1 items-center grid grid-cols-5 mx-auto ">
    <div>
      <storm-ui-action-with-counter
        icon-default="message-reply"
        icon-active="message-reply"
        color="text-blue-500"
        :active="!!post.viewer?.reply"
        :counter="post.replyCount"
      />
    </div>

    <div class="pt-1">
      <storm-ui-menu
        origin="top-left"
        width-class="w-64 z-500"
      >
        <template #trigger>
          <storm-ui-action-with-counter
            icon-default="message-share"
            icon-active="message-share"
            color="text-green-500"
            :active="!!post.viewer?.repost"
            :counter="post.repostCount"
          />
        </template>
        <div>
          <storm-ui-menu-item
            icon="tabler-message-share"
            :label="isRepost ? 'Repost rückgängig machen' : 'Repost'"
            @click="onRepost"
          />
          <storm-ui-menu-item
            disabled
            icon="tabler-quote"
            label="Zitieren"
          />
        </div>
      </storm-ui-menu>
    </div>
    <div>
      <storm-ui-action-with-counter
        icon-default="heart"
        icon-active="heart-filled"
        color="text-red-500"
        :active="!!post.viewer?.like"
        :counter="post.likeCount"
        @click="onLikePost"
      />
    </div>
    <div />
    <div>
      <storm-ui-menu
        origin="top-right"
        width-class="w-64 z-500"
      >
        <template #trigger>
          <storm-ui-action-with-counter
            icon-default="dots"
            icon-active="dots"
            icon-size="lg"
            color="text-gray-500"
          />
        </template>
        <div>
          <storm-ui-menu-item
            icon="tabler-code"
            label="Skeet-JSON"
            @click="onDump"
          />
        </div>
      </storm-ui-menu>
    </div>
  </div>
</template>
