<script setup lang="ts">
import { computed, ref } from 'vue'
import PostEmbedImagesImage from './PostEmbedImagesImage.vue'
import { AppBskyEmbedImages } from '@atproto/api'

export type Props = {
  images: AppBskyEmbedImages.View[]
}

const props = defineProps<Props>()

const gridCols = computed(() => {
  return {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-2',
    4: 'grid-cols-2'

  }[props.images.length]
})

const getThumb = (image: AppBskyEmbedImages.View) => {
  return image.thumb as string
}

const lightboxIndex = ref(0)
const lightboxVisibile = ref(false)

const lightboxImages = computed(() => props.images?.map(item => item.fullsize) as unknown[])

const showLigtbox = (index: number) => {
  lightboxIndex.value = index
  lightboxVisibile.value = true
}

</script>

<template>
  <div>
    <ul
      v-if="images"
      class="grid gap-2 mx-auto"
      :class="gridCols"
    >
      <PostEmbedImagesImage
        v-for="(image, index) in images"
        :key="index"
        :image="getThumb(image)"
        @click="showLigtbox(index)"
      />
    </ul>
  </div>
</template>
