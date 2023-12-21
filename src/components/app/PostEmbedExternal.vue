<script setup lang="ts">
import { computed } from 'vue'

export type EmbedExternal = {
  description: string,
  thumb: string,
  title: string,
  uri: string
}

export interface Props {
  external: EmbedExternal
}

const props = defineProps<Props>()

const uri = computed(() => {
  const url = new URL(props.external.uri)
  return url.host.replace('www.', '')
})

</script>

<template>
  <div class="mx-auto max-w-md overflow-hidden border rounded-md bg-white shadow-sm pb-2 my-6">
    <img
      :src="external.thumb"
      class="w-full object-cover"
      alt=""
    >
    <div class="p-4">
      <p class="mb-1 text-sm text-primary-500 text-blue-800">
        <a
          :href="external.uri"
          target="_blank"
          class="hover:underline"
        > {{ uri }}</a>
      </p>
      <h3
        v-tooltip="external.title"
        class="text-lg font-medium text-gray-900 truncate"
      >
        {{ external.title }}
      </h3>
      <p
        class="mt-1 text-gray-500 hyphens-auto leading-snug text-base"
        v-html="external.description"
      />
    </div>
  </div>
</template>
