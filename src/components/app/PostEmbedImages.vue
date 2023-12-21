<script setup lang="ts">
import { computed } from 'vue'
import PostEmbedImagesImage from './PostEmbedImagesImage.vue'

export type AspectRatio = {
  height: number,
  width: number
}

export type EmbedImage = {
  alt: string,
  fullsize: string,
  thumb: string,
  aspectRatio: AspectRatio
}

export interface Props {
  images: EmbedImage[]
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
</script>

<template>
  <div
    class="my-6 grid gap-2 mx-auto"
    :class="[gridCols]"
  >
    <PostEmbedImagesImage
      v-for="(image, index) in images"
      :key="index"
      :image="image"
    />
  </div>
</template>
