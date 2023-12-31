<script setup lang="ts">

import { computed } from 'vue'
import { useRichText } from '@/composables/useRichText.ts'
import { AppBskyRichtextFacet } from '@atproto/api'

export interface Props {
  langs: string[] | undefined
  text: string
  facets: AppBskyRichtextFacet.Main[] | undefined
  isEmbeded?: boolean
}

const { render } = useRichText()

const props = withDefaults(defineProps<Props>(), {
  isEmbeded: false
})

const renderedText = computed(() => {
  return render(props.text, props.facets)
})

</script>

<template>
  <div class="flex items-stretch flex-col cursor-pointer">
    <div
      class="text-lg leading-snug text-black text-left py-2 flex-1 flex-wrap break-words hyphens-auto markdown"
      :class="isEmbeded ? 'text-base' : 'mr-2 text-lg'"
      v-html="renderedText"
    />
  </div>
</template>
