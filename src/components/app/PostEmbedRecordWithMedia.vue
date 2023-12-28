<script setup lang="ts">
import { AppBskyEmbedRecordWithMedia, AppBskyFeedPost, AppBskyFeedDefs, AppBskyEmbedImages } from '@atproto/api'
import { computed } from 'vue'
import { type ViewImage } from '@atproto/api/dist/client/types/app/bsky/embed/images.js'

type PostView = AppBskyFeedDefs.PostView
type FeedPostRecord = AppBskyFeedPost.Record

export interface Props {
  record: FeedPostRecord
  post?: PostView
}

const props = withDefaults(defineProps<Props>(), {
  post: undefined
})

const recordValue = computed(() => props.record.record as FeedPostRecord)
const postValue = computed<PostView>(() => props.post as PostView)
const embed = computed(() => postValue.value.embed as AppBskyEmbedImages.View)
const media = computed(() => embed.value.media as AppBskyEmbedImages.View)
const images = computed(() => media.value.images as ViewImage[])

const recordEmbeds = computed(() => recordValue.value.embeds as AppBskyEmbedImages.View[])
const recordEmbed = computed(() => recordEmbeds.value[0] as AppBskyEmbedImages.View)
const recordEmbedMedia = computed(() => recordEmbed.value.media as AppBskyEmbedRecordWithMedia.View)
const recordEmbedRecord = computed(() => recordEmbed.value.record as AppBskyEmbedRecordWithMedia.View)

</script>

<template>
  <div>
    <app-post-embed-images :images="images" />
    <div class="border rounded-md w-full flex-1 mr-0 pr-0">
      <app-post
        :is-embeded="true"
        :author="recordValue.author"
        :indexed-at="recordValue.indexedAt"
        :post="recordValue"
        :uri="recordValue.uri"
        :record="recordEmbedRecord.record.value"
        :embed="recordEmbedMedia"
        :embed-type="recordEmbedMedia?.$type"
      />
    </div>
  </div>
</template>
