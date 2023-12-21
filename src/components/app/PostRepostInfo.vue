<script setup lang="ts">
import { AppBskyActorDefs } from '@atproto/api'
type Author = AppBskyActorDefs.ProfileViewBasic

export interface Props {
  by: Author
}

defineProps<Props>()

</script>

<template>
  <div class="flex-1 flex">
    <div class="flex-none">
      <storm-ui-avatar
        class="mx-auto"
        :src="by.avatar"
        :size="6"
        :alt="by.handle"
      />
    </div>
    <div class="flex-1 flex-col  py-4 pr-2 flex">
      <div
        class="text-xl text-black font-bold pb-0.5"
      >
        {{ by.displayName || by.handle }}
      </div>
    </div>
  </div>
</template>
