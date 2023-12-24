<script setup lang="ts">

import { computed } from 'vue'
import { useRichText } from '@/composables/useRichText.ts'
import { AppBskyRichtextFacet } from '@atproto/api'

export interface Props {
  type: string
  langs: string[] | undefined
  text: string
  facets: AppBskyRichtextFacet.Main[] | undefined
}

const { render } = useRichText()
const props = defineProps<Props>()

const renderedText = computed(() => {
  return render(props.text, props.facets)
})

</script>

<template>
  <div class="flex items-stretch flex-col">
    <div
      class="text-lg leading-snug text-black text-left py-2 mr-2  flex-1 flex-wrap break-words hyphens-auto markdown"
      v-html="renderedText"
    />
  </div>
</template>
