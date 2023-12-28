<script setup lang="ts">
import { AppBskyActorDefs } from '@atproto/api'
import { ref } from 'vue'
import PostProfileHoverCardContent from './PostProfileHoverCardContent.vue'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/shadn/ui/hover-card'
import { useSkySessionStore } from '@/stores/SkySessionStore.ts'

type Author = AppBskyActorDefs.ProfileViewBasic
type AuthorDetailed = AppBskyActorDefs.ProfileViewDetailed

const sessionStore = await useSkySessionStore()

const profileCardOpen = ref(false)
const actorDetails = ref<AuthorDetailed | null>(null)

export interface Props {
  actor: Author
}

const props = defineProps<Props>()

const onLoadProfile = async () => {
  if (profileCardOpen.value === false) {
    actorDetails.value = await sessionStore.getActorProfile(props.actor.handle, true)
    profileCardOpen.value = true
  }
}

</script>

<template>
  <HoverCard @updated="onLoadProfile()">
    <HoverCardTrigger>
      <slot />
    </HoverCardTrigger>
    <HoverCardContent class="w-full max-w-sm min-w-[24rem]">
      <PostProfileHoverCardContent
        :actor="actor"
        :complete-actor-profile="actorDetails"
      />
    </HoverCardContent>
  </HoverCard>
</template>
