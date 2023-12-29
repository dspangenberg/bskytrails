<script setup lang="ts">
import { AppBskyActorDefs } from '@atproto/api'
import { useTemplateFilter } from '@/composables/useTemplateFilter.ts'
import { useSkySessionStore } from '@/stores/SkySessionStore.ts'
import { computed } from 'vue'

const skySessionStore = useSkySessionStore()

const { toMd } = useTemplateFilter()

type Author = AppBskyActorDefs.ProfileViewBasic
type AuthorDetailed = AppBskyActorDefs.ProfileViewDetailed

export interface Props {
  actor: Author
  completeActorProfile: AuthorDetailed | null
}

const props = defineProps<Props>()
const isMe = computed(() => props.actor.did === skySessionStore.getCurrentDid())

</script>

<template>
  <div class="animate-in fade-in  duration-150">
    <div class="flex items-center ">
      <div class="flex-none">
        <storm-ui-avatar
          class="cursor-pointer"
          :src="actor.avatar"
          :alt="actor.handle"
          :size="12"
          :spinner="!completeActorProfile"
        />
      </div>
      <div class="ml-2 flex-1 truncate mr-2">
        <div
          v-if="actor.displayName"
          class="text-lg font-medium"
        >
          {{ actor.displayName }}
        </div>
        <div
          class="text-sm text-gray-500 truncate"
        >
          <span
            v-if="actor.viewer?.followedBy && !isMe"
            class="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20"
          >
            Folgt Dir
          </span>
          @{{ actor.handle }}
        </div>
      </div>
      <div
        v-if="completeActorProfile"
        class="flex-none"
      >
        <storm-ui-icon-button
          v-if="completeActorProfile.viewer?.following"
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
      v-if="completeActorProfile"
      class="pt-2"
    >
      <div
        v-if="completeActorProfile.description"
        class="text-base text-black leading-normal markdown break-words hyphens-auto"
        v-html="toMd(completeActorProfile.description)"
      />
      <div class="text-base font-medium text-center space-x-2 " />
    </div>
  </div>
</template>
