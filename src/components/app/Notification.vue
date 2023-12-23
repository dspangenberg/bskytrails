<script setup lang="ts">
// AppBskyEmbedRecord, AppBskyEmbedRecordWithMediaA ppBskyEmbedImages, AppBskyEmbedExternal
import { AppBskyFeedPost, AppBskyNotificationListNotifications, AppBskyActorDefs, AppBskyFeedDefs } from '@atproto/api'
import { computed, ref } from 'vue'
import { useBookmarkStore } from '@/stores/BookmarkStore.ts'
import PostEmbedExternal from './PostEmbedExternal.vue'
import PostEmbedImages from './PostEmbedImages.vue'
import PostEmbedRecord from './PostEmbedRecord.vue'
import PostAnswerContext from './PostAnswerContext.vue'

import PostFooter from './PostFooter.vue'

import PostProfileHoverCard from './PostProfileHoverCard.vue'
import { useRouter } from 'vue-router'
import { useRichText } from '@/composables/useRichText.ts'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/shadn/ui/hover-card'
import { useSkySessionStore } from '@/stores/SkySessionStore.ts'

const sessionStore = await useSkySessionStore()

const bookmarkStore = useBookmarkStore()
type FeedPostRecord = AppBskyFeedPost.Record
type Reply = AppBskyFeedDefs.ReplyRef
type Reason = AppBskyFeedDefs.ReasonRepost
type Author = AppBskyActorDefs.ProfileViewBasic
type AuthorDetailed = AppBskyActorDefs.ProfileViewDetailed | null
type PostView = AppBskyFeedDefs.PostView
type Notification = AppBskyNotificationListNotifications.Notification

const profileCardOpen = ref(false)
const authorDetails = ref<AuthorDetailed | null>(null)
const props = defineProps<Props>()

const router = useRouter()

export interface Props {
  notification: Notification
}

const author = computed<AuthorDetailed>(() => props.notification.author)
const typeIcon = computed<string>(() => {
  switch (props.notification.reason) {
    case 'like':
      return {
        icon: 'heart-filled',
        color: 'text-red-500'
      }
    case 'follow':
      return {
        icon: 'star-filled',
        color: 'text-green-500'
      }
    case 'reply':
      return {
        icon: 'message-circle-2-filled',
        color: 'text-blue-500'
      }
  }
  return 'dots'
})

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
  switch (props.record.embed?.$type) {
    case 'app.bsky.embed.record#view':
      return PostEmbedRecord
    case 'app.bsky.embed.images':
      return PostEmbedImages
    case 'app.bsky.embed.external#view':
      return PostEmbedExternal
  }
  return null
})

const onLoadProfile = async () => {
  if (profileCardOpen.value === false) {
    authorDetails.value = await sessionStore.getActorProfile(props.author.handle, true)
    profileCardOpen.value = true
  }
}

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
  <li class="grid grid-cols-10 px-2 space-x-2">
    <div class="col-start-2 col-span-11">
      <div
        v-if="isRepost"
        class="text-stone-400 text-sm px-4 pt-4 flex items-center"
      >
        <div
          class="flex-1"
        >
          Repost
          von
          <a
            href=""
            class="font-medium hover:underline"
          >
            {{ reason?.by?.displayName }}
          </a>
        </div>
      </div>
    </div>
    <div class="mt-3 ml-4">
      <HoverCard @updated="onLoadProfile()">
        <HoverCardTrigger>
          <storm-ui-avatar
            class="cursor-pointer"
            :src="author.avatar"
            :alt="author.handle"
            :size="12"
            :icon="typeIcon.icon"
            :icon-color="typeIcon.color"
            @click="goProfile(author.handle)"
          />
        </HoverCardTrigger>
        <HoverCardContent class="w-full max-w-sm min-w-[24rem]">
          <PostProfileHoverCard
            :profile="author"
            :complete-profile="authorDetails"
          />
        </HoverCardContent>
      </HoverCard>
    </div>
    <div class="col-span-11 pl-2">
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
            v-tooltip="indexedAtFormated"
            :date="notification.indexedAt"
          />
        </div>
      </div>
    </div>
  </li>
</template>
