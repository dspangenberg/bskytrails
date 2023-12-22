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
          :spinner="!completeProfile"
        />
      </div>
      <div class="ml-2 flex-1">
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
      <div
        v-if="completeProfile"
        class="flex-none"
      >
        <storm-ui-icon-button
          v-if="completeProfile.viewer?.following"
          icon="user-x"
          variant="danger"
        />
        <storm-ui-icon-button
          v-else
          variant="primary"
          icon="user-check"
        />
      </div>
    </div>

    <div
      v-if="completeProfile"
      class="pt-2"
    >
      <div
        v-if="completeProfile.description"
        class="text-base text-black leading-relaxed markdown break-words hyphens-auto"
        v-html="toMd(completeProfile.description)"
      />
      <div class="text-base font-medium text-center space-x-2 " />
    </div>
  </div>
</template>
