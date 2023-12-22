<script setup lang="ts">
import { AppBskyFeedPost, AppBskyActorDefs, AppBskyFeedDefs } from '@atproto/api'
import { computed, ref } from 'vue'
import { useBookmarkStore } from '@/stores/BookmarkStore.ts'
import PostEmbedExternal from './PostEmbedExternal.vue'
import PostEmbedImages from './PostEmbedImages.vue'
import PostFooter from './PostFooter.vue'
import PostProfileHoverCard from './PostProfileHoverCard.vue'
import { useRouter } from 'vue-router'
import { useTemplateFilter } from '@/composables/useTemplateFilter.ts'
import { useRichText } from '@/composables/useRichText.ts'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/shadn/ui/hover-card'
import { useElementHover } from '@vueuse/core'
import { useSkySessionStore } from '@/stores/SkySessionStore.ts'

const sessionStore = await useSkySessionStore()

const bookmarkStore = useBookmarkStore()
type FeedPostRecord = AppBskyFeedPost.Record
type FeedPost = AppBskyFeedDefs.FeedViewPost
type Reply = AppBskyFeedDefs.ReplyRef
type Reason = AppBskyFeedDefs.ReasonRepost
type Author = AppBskyActorDefs.ProfileViewBasic
type AuthorDetailed = AppBskyActorDefs.ProfileViewDetailed

const profileCardOpen = ref(false)
const authorDetails = ref<AuthorDetailed | null>(null)

const router = useRouter()
const { toMd } = useTemplateFilter()

export interface Props {
  post: FeedPost
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

const onLoadProfile = async () => {
  if (profileCardOpen.value === false) {
    authorDetails.value = await sessionStore.getActorProfile(props.author.handle, true)
    profileCardOpen.value = true
  }
}

const bookmarkedCids = computed(() => bookmarkStore.bookmarkedCids)

const isBookmarked = computed(() => {
  return bookmarkedCids.value.includes(props.post.uri)
})

const { render } = useRichText()

const renderText = (record: FeedPostRecord) => {
  return render(record)
}

const myHoverableElement = ref()
const isExpanded = useElementHover(myHoverableElement, { delayEnter: 500 })

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

const getThread = (uri: string) => {
  router.push({
    name: 'thread',
    params: {
      uri: encodeURI(uri)
    }
  })
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
      <HoverCard @updated="onLoadProfile(event)">
        <HoverCardTrigger>
          <storm-ui-avatar
            class="cursor-pointer"
            :src="author.avatar"
            :alt="author.handle"
            :size="12"
            :icon="avatarIcon"
            @click="goProfile(author.handle)"
          />
        </HoverCardTrigger>
        <HoverCardContent class="w-full max-w-sm">
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
            class="text-base text-black font-medium leading-relaxed flex-1 flex "
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
            :date="post.indexedAt"
          />
          <div>
            <storm-ui-action-with-counter
              icon-default="bookmark"
              icon-active="bookmark-filled"
              icon-size="lg"
              color="text-blue-400"
              :active="isBookmarked === true"
              @click="onBookmarkToogle(isBookmarked)"
            />
          </div>
        </div>
      </div>

      <div
        v-if="isReply"
        class="text-sm leading-snug text-gray-500 text-left my-2 break-words flex-1 flex-wrap hyphens-auto border-l-4 pl-2"
        @click="getThread(reply?.parent.uri)"
      >
        <span class="font-normal text-stone-400 ">
          Antwort an {{ reply?.parent.author.handle }}</span>
        <span
          ref="myHoverableElement"
          :class="!isExpanded ? 'line-clamp-2' : ''"
          v-html="renderText(reply?.parent.record)"
        />
      </div>

      <div
        class="text-lg leading-snug text-black text-left py-2 break-words flex-1 flex-wrap hyphens-auto markdown"
        @click="getThread(post?.uri)"
      >
        <span v-html="renderText(record)" />
      </div>

      <div
        v-if="post.embed"
        class="flex-1 whitespace-break-spaces overflow-x-hidden break-words mx-0 px-0 items-start"
      >
        <template v-if="post.embed.$type === 'app.bsky.embed.record#view'">
          Quote
        </template>
        <template v-if="post.embed.$type === 'app.bsky.embed.images#view'">
          <PostEmbedImages :images="post.embed.images" />
        </template>
        <template v-if="post.embed.$type === 'app.bsky.embed.external#view'">
          <PostEmbedExternal :external="post.embed.external" />
        </template>
      </div>
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
  </li>
</template>
