<script setup lang="ts">
import { AppBskyFeedPost, AppBskyActorDefs, AppBskyFeedDefs } from '@atproto/api'
import { computed, ref } from 'vue'
import PostContent from './PostContent.vue'
import ListViewItem from './ListViewItem.vue'
import PostProfileHoverCard from './PostProfileHoverCard.vue'
import PostFooter from './PostFooter.vue'

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
  action?: string
}

withDefaults(defineProps<Props>(), {
  action: 'Repost von'
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
  <div
    class="text-stone-400 text-sm flex items-center"
  >
    <div
      class="flex-1 flex items-center"
    >
      {{ action }}
      <a
        class="font-medium cursor-pointer flex items-center"
        @click="goProfile(author.handle)"
      >
        <PostProfileHoverCard
          :actor="author"
        >
          <div class="flex items-center pl-1">
            <storm-ui-avatar
              class="cursor-pointer"
              :src="author.avatar"
              :alt="author.handle"
              :size="6"
              @click="goProfile(author.handle)"
            />
            <span class="pl-1">
              {{ author.handle }}
            </span>
          </div>
        </PostProfileHoverCard>
      </a>
    </div>
  </div>
</template>
