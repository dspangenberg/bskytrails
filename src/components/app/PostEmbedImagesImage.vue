<script setup lang="ts">
import { AppBskyEmbedImages } from '@atproto/api'
export interface Props {
  image: AppBskyEmbedImages.ViewImage
}

defineProps<Props>()

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
