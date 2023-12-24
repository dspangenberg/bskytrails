<script setup lang="ts">
import { AppBskyActorDefs } from '@atproto/api'
import PostProfileHoverCard from './PostProfileHoverCard.vue'
import { useRouter } from 'vue-router'

type Author = AppBskyActorDefs.ProfileViewBasic
type AuthorDetailed = AppBskyActorDefs.ProfileViewDetailed

const router = useRouter()

export interface Props {
  author: Author | AuthorDetailed
  action?: string
}

withDefaults(defineProps<Props>(), {
  action: 'Repost von'
})

const goProfile = (handle: string) => {
  router.push({
    name: 'profile',
    params: {
      handle
    }
  })
}

</script>

<template>
  <div
    class="text-stone-400 text-sm flex items-center"
  >
    <div
      class="flex-1 flex items-center"
    >
      {{ action }}
      <a
        class="font-medium cursor-pointer flex items-center"
        @click="goProfile(author.handle)"
      >
        <PostProfileHoverCard
          :actor="author"
        >
          <div class="flex items-center pl-1">
            <storm-ui-avatar
              class="cursor-pointer"
              :src="author.avatar"
              :alt="author.handle"
              :size="6"
              @click="goProfile(author.handle)"
            />
            <span class="pl-1">
              {{ author.handle }}
            </span>
          </div>
        </PostProfileHoverCard>
      </a>
    </div>
  </div>
</template>
