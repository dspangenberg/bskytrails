<script setup lang="ts">
// AppBskyEmbedRecord, AppBskyEmbedRecordWithMediaA ppBskyEmbedImages, AppBskyEmbedExternal
import { AppBskyFeedPost, AppBskyActorDefs, AppBskyFeedDefs } from '@atproto/api'
import { computed, ref } from 'vue'
import { useBookmarkStore } from '@/stores/BookmarkStore.ts'
import PostRecord from './PostRecord.vue'
import PostHeader from './PostHeader.vue'

import PostEmbedExternal from './PostEmbedExternal.vue'
import PostEmbedImages from './PostEmbedImages.vue'
import PostEmbedRecord from './PostEmbedRecord.vue'
import PostAnswerContext from './PostAnswerContext.vue'
import PostProfileHoverCard from './PostProfileHoverCard.vue'
import PostEmbedRecordWithMedia from './PostEmbedRecordWithMedia.vue'
import PostEmbed from './PostEmbed.vue'

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
  post: PostView
  record: FeedPostRecord
  author: Author
  reason?: Reason
  reply?: Reply
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
    case 'app.bsky.embed.images#view':
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
  <div>
    <div class="grid grid-cols-16 px-2 space-x-2">
      <div class="col-start-3 col-span-12">
        <div
          v-if="isRepost"
          class="text-stone-400 text-sm px-4 pt-4 flex items-center"
        >
          <div
            class="flex-1 flex items-center"
          >
            Repost von
            <a
              class="font-medium cursor-pointer flex items-center"
              @click="goProfile(reason?.by?.handle)"
            >
              <PostProfileHoverCard
                :actor="reason?.by"
              >
                <div class="flex items-center pl-1">
                  <storm-ui-avatar
                    class="cursor-pointer"
                    :src="reason?.by.avatar"
                    :alt="reason?.by.handle"
                    :size="6"
                    @click="goProfile(reason?.by?.handle)"
                  />
                  <span class="pl-1">
                    {{ reason?.by?.handle }}
                  </span>
                </div>
              </PostProfileHoverCard>
            </a>
          </div>
        </div>
      </div>
    </div>

    <PostHeader
      :author="author"
      :indexed-at="post.indexedAt"
    />

    <div class="grid grid-cols-16 px-2 space-x-2">
      <div class="col-start-3 col-span-14 mt-2 ml-4 ">
        <PostAnswerContext
          v-if="isReply && reply"
          :reply="reply"
        />

        <div
          class="text-lg leading-snug text-black text-left py-2 mr-2  flex-1 flex-wrap break-words hyphens-auto markdown"
          @click="getThread(post?.uri)"
        >
          <span v-html="renderText(record)" />
        </div>

        <PostEmbed
          v-if="post.embed"
          :type="post.embed?.$type"
          :embed="post.embed"
        />

        <div class="pb-3 grid-cols-3">
          <PostFooter
            :post="post"
            :reason="reason"
            :record="record"
            :author="author"
            :reply="reply"
          />
        </div>
      </div>
    </div>
  </div>
</template>
