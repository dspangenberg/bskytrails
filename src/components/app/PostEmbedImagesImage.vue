<script setup lang="ts">
import { computed } from 'vue'

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
  image: EmbedImage
}

const props = defineProps<Props>()

</script>

<template>
  <div>
    <img
      :src="image.thumb"
      class="object-cover border rounded-md shadow-sm"
      alt=""
    >
  </div>
</template>
