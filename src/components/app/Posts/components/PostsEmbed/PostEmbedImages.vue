<script setup lang="ts">
import { computed, ref } from 'vue'
import PostEmbedImagesImage from './PostEmbedImagesImage.vue'
import { AppBskyEmbedImages } from '@atproto/api'

export type Props = {
  images: AppBskyEmbedImages.View[]
}

const props = defineProps<Props>()

type Image = {
  src: string
  description: string
}

const gridCols = computed(() => {
  return {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-2',
    4: 'grid-cols-2'

  }[props.images.length]
})

const silentbox = ref<HTMLFormElement | null>(null)

const getThumb = (image: AppBskyEmbedImages.View) => {
  return image.thumb as string
}

const lightboxIndex = ref(0)
const lightboxVisibile = ref(false)

const lightboxImages = computed<Image>(() => props.images?.map(item => {
  return {
    src: item.fullsize as string,
    description: item.alt as string,
    thumbnail: item.thumb as string,
    thumbnailWidth: 'auto'
  }
}))

const showLigtbox = (item, index) => {
  console.log(silentbox.value)
  silentbox.value.open(item)
}

</script>

<template>
  <div class="gallery flex flex-1 my-3">
    <silent-box
      ref="silentbox"
      :gallery="lightboxImages"
    />
  </div>
</template>
