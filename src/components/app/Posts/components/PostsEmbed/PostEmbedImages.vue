<script setup lang="ts">
import { computed, ref } from 'vue'
import { AppBskyEmbedImages } from '@atproto/api'

export type Props = {
  images: AppBskyEmbedImages.View[]
}

const props = defineProps<Props>()

type Image = {
  src: string
  description: string,
  thumbnail: string,
  thumbnailWidth: string
}

const silentbox = ref<HTMLFormElement | null>(null)

const lightboxImages = computed<Image>(() => props.images?.map(item => {
  return {
    src: item.fullsize as string,
    description: item.alt as string,
    thumbnail: item.thumb as string,
    thumbnailWidth: 'auto'
  }
}))
</script>

<template>
  <div class="gallery flex flex-1 my-3">
    <silent-box
      ref="silentbox"
      :gallery="lightboxImages"
    />
  </div>
</template>
