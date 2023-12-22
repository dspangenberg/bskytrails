<script setup lang="ts">
import { AppBskyEmbedExternal } from '@atproto/api'
import { computed } from 'vue'

export interface Props {
  data: AppBskyEmbedExternal.View
}

const props = defineProps<Props>()

const thumb = computed(() => props.data.thumb as string)
const url = computed(() => props.data.uri as string)

const uri = computed<string>(() => {
  const urll = new URL(url.value)
  return urll.host.replace('www.', '')
})

</script>

<template>
  <div class="mx-auto max-w-md overflow-hidden border rounded-md bg-white shadow-sm pb-2 my-6">
    <img
      :src="thumb"
      class="w-full object-cover"
      alt=""
    >
    <div class="p-4">
      <p class="mb-1 text-sm text-primary-500 text-blue-800">
        <a
          :href="url"
          target="_blank"
          class="hover:underline"
        > {{ uri }}</a>
      </p>
      <h3
        v-tooltip="data.title"
        class="text-lg font-medium text-gray-900 truncate"
      >
        {{ data.title }}
      </h3>
      <p
        class="mt-1 text-gray-500 hyphens-auto leading-snug text-base"
        v-html="data.description"
      />
    </div>
  </div>
</template>
