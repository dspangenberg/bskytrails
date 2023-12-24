<script setup lang="ts">
// AppBskyEmbedRecord, AppBskyEmbedRecordWithMediaA ppBskyEmbedImages, AppBskyEmbedExternal
import { AppBskyFeedPost, AppBskyActorDefs, AppBskyFeedDefs } from '@atproto/api'
import { computed, ref } from 'vue'
import { useBookmarkStore } from '@/stores/BookmarkStore.ts'
import PostRecord from './PostRecord.vue'
import PostEmbedExternal from './PostEmbedExternal.vue'
import PostEmbedImages from './PostEmbedImages.vue'
import PostEmbedRecord from './PostEmbedRecord.vue'
import PostAnswerContext from './PostAnswerContext.vue'
import PostProfileHoverCard from './PostProfileHoverCard.vue'
import PostEmbedRecordWithMedia from './PostEmbedRecordWithMedia.vue'

import PostFooter from './PostFooter.vue'

import { useRouter } from 'vue-router'
import { useRichText } from '@/composables/useRichText.ts'

const bookmarkStore = useBookmarkStore()
type FeedPostRecord = AppBskyFeedPost.Record
type Reply = AppBskyFeedDefs.ReplyRef
type Reason = AppBskyFeedDefs.ReasonRepost
type Author = AppBskyActorDefs.ProfileViewBasic

type PostView = AppBskyFeedDefs.PostView

const router = useRouter()

export interface Props {
  author: Author
  indexedAt: string
}
const avatarIcon = computed(() => {
  if (isRepost.value) {
    return 'message-share'
  }
  if (isReply.value) {
    return 'message-reply'
  }
  return undefined
})

const embedComponent = computed(() => {
  switch (props.post.embed?.$type) {
    case 'app.bsky.embed.record#view':
      return PostEmbedRecord
    case 'app.bsky.embed.images':
      return PostEmbedImages
    case 'app.bsky.embed.external#view':
      return PostEmbedExternal
    case 'app.bsky.embed.recordWithMedia#view':
      return PostEmbedRecordWithMedia
  }
  return null
})

const bookmarkedCids = computed(() => bookmarkStore.bookmarkedCids)

const isBookmarked = computed(() => {
  if (props.post.uri) {
    return bookmarkedCids.value.includes(props.post.uri.toString())
  }
  return false
})

const { render } = useRichText()

const renderText = (record: FeedPostRecord) => {
  return render(record)
}

const props = defineProps<Props>()
const isRepost = computed(() => props.reason?.$type === 'app.bsky.feed.defs#reasonRepost')
const isReply = computed(() => props.reply?.parent?.$type === 'app.bsky.feed.defs#postView')
const indexedAtFormated = computed(() => props.post?.indexedAt)

const onBookmarkToogle = async (value: boolean) => {
  if (value) {
    await bookmarkStore.removeBookmark(props.post)
  } else {
    await bookmarkStore.addBookmark(props.post)
  }
}

const getThread = (uri: string | undefined) => {
  if (uri !== undefined) {
    router.push({
      name: 'thread',
      params: {
        uri: encodeURI(uri)
      }
    })
  }
}

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
  <div class="grid grid-cols-16 px-2 space-x-2">
    <div class="mt-2 ml-4 col-span-2">
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
    </div>
    <div class="col-span-14 pl-2">
      <div class="min-w-0 flex-1 flex">
        <div
          class="flex-1 flex-col  py-3 pr-2 flex cursor-pointer"
          @click="goProfile(author.handle)"
        >
          <div
            class="text-base text-black font-medium leading-normal flex-1 flex "
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
        </div>
        <div class="text-gray-400 text-sm flex items-center flex-none space-x-2">
          <storm-ui-time-ago
            v-tooltip="indexedAt"
            :date="indexedAt"
          />
          <div>
            <storm-ui-action-with-counter
              icon-default="bookmark"
              icon-active="bookmark-filled"
              icon-size="lg"
              color="text-blue-400"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
