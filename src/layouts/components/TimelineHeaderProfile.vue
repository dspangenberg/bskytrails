<script setup lang="ts">
import { useTemplateFilter } from '@/composables/useTemplateFilter.ts'
import { storeToRefs } from 'pinia'
import { useSkySessionStore } from '@/stores/SkySessionStore.ts'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const { toMd, formatInt } = useTemplateFilter()
const route = useRoute()

export interface Props {
  title?: string
}

const skySessionStore = useSkySessionStore()
const { isLoadingProfile, actor } = storeToRefs(skySessionStore)

const isMe = computed(() => actor.value?.did === skySessionStore.getCurrentDid())

const onFollow = async () => {
  if (actor.value?.did) {
    await skySessionStore.follow(actor.value.did.toString())
  }
}

watch(route, async (route) => {
  if (route.name === 'profile') {
    await skySessionStore.getActorProfile(route.params.handle.toString())
  }
}, { immediate: true })

</script>

<template>
  <div>
    <div v-if="!isLoadingProfile">
      <div
        v-if="actor"
        class="flex flex-1 relative z-100 flex-col"
      >
        <div class="text-xl font-bold flex-1 mb-4">
          <img
            :src="actor.banner"
            class="h-[150px] w-[600px] object-cover cursor-pointer"
          >
          <div class="absolute pl-4">
            <img
              :src="actor.avatar"
              class="w-[75px] p-1 object-cover cursor-pointer -mt-12 rounded-full bg-white"
            >
          </div>
        </div>
        <div class="px-4 pt-6 pb-3 text-xl font-bold flex flex-1 items-center">
          <div class="flex-1 text-black">
            {{ actor.displayName }}
            <div class="text-sm text-gray-600 font-normal pt-1">
              <span
                v-if="actor.viewer?.followedBy && !isMe"
                class="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-sm font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20"
              >Folgt Dir</span>
              @{{ actor.handle }}
            </div>
          </div>
          <div
            v-if="!isMe"
            class="text-base font-medium text-center space-x-2"
          >
            <storm-ui-button
              v-if="actor.viewer?.following"
              icon="user-x"
              @click="onFollow"
            >
              Entfolgen
            </storm-ui-button>
            <storm-ui-button
              v-else
              icon="user-check"
              variant="primary"
              @click="onFollow"
            >
              Folgen
            </storm-ui-button>
            <storm-ui-button
              icon="dots"
            />
          </div>
        </div>
        <div class="text-base px-4">
          {{ formatInt(actor?.followersCount || 0) }} Folgende&nbsp;&nbsp;
          {{ formatInt(actor?.followsCount || 0) }} Folgt&nbsp;&nbsp;
          {{ formatInt(actor?.postsCount || 0) }} Posts
        </div>
        <div
          v-if="actor.description"
          class="text-base font-normal leading-snug text-black text-left py-3 break-words flex-1 flex-wrap hyphens-auto px-4 markdown"
          v-html="toMd(actor.description)"
        />
        <div>
          <storm-ui-pivot class="text-base px-4 mt-2">
            <storm-ui-pivot-item
              label="Originals"
              active
            />
            <storm-ui-pivot-item label="Reposts" />
            <storm-ui-pivot-item label="Antworten" />
            <storm-ui-pivot-item label="Medien" />
            <storm-ui-pivot-item label="Listen" />
            <storm-ui-pivot-item label="Feeds" />
            <storm-ui-pivot-item label="Likes" />
          </storm-ui-pivot>
        </div>
      </div>
    </div>
  </div>
</template>
