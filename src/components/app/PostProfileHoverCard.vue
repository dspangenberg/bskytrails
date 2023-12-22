<script setup lang="ts">
import { useRouter } from 'vue-router'
import { AppBskyActorDefs } from '@atproto/api'
import { useTemplateFilter } from '@/composables/useTemplateFilter.ts'

const { toMd, formatInt } = useTemplateFilter()

type Author = AppBskyActorDefs.ProfileViewBasic
type AuthorDetailed = AppBskyActorDefs.ProfileViewDetailed

export interface Props {
  profile: Author
  completeProfile: AuthorDetailed | null
}

defineProps<Props>()
</script>

<template>
  <div>
    <div class="flex items-center ">
      <div class="flex-none">
        <storm-ui-avatar
          class="cursor-pointer"
          :src="profile.avatar"
          :alt="profile.handle"
          :size="12"
        />
      </div>
      <div class="ml-2">
        <div
          v-if="profile.displayName"
          class="text-lg font-medium"
        >
          {{ profile.displayName }}
        </div>
        <div
          class="text-sm text-gray-500"
        >
          {{ profile.handle }}
        </div>
      </div>
    </div>

    <div
      v-if="completeProfile"
      class="pt-2"
    >
      <div
        v-if="completeProfile.description"
        class="text-base text-black leading-relaxed markdown"
        v-html="toMd(completeProfile.description)"
      />
    </div>
    <template v-else>
      <storm-ui-spinner
        :size="4"
      />
    </template>
  </div>
</template>
