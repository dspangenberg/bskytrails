<script setup lang="ts">
import { useTemplateFilter } from '@/composables/useTemplateFilter.ts'
import { storeToRefs } from 'pinia'
import { useSkySessionStore } from '@/stores/SkySessionStore.ts'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const { toMd, formatInt } = useTemplateFilter()
const route = useRoute()

export interface Props {
  title?: string
}

const skySessionStore = useSkySessionStore()
const { isProfileLoading, actor } = storeToRefs(skySessionStore)

defineProps<Props>()

const onFollow = async () => {
  await skySessionStore.follow(actor.value.did)
}

watch(route, async (route) => {
  if (route.name === 'profile') {
    await skySessionStore.getActorProfile(route.params.handle)
  }
}, { immediate: true })

</script>

<template>
  <div>
    <div v-if="!isProfileLoading">
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
          <div class="flex-1">
            {{ actor.displayName }}
            <div class="text-sm text-gray-600 font-normal">
              @{{ actor.handle }}
              <span
                v-if="actor.viewer.followedBy"
                class="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-sm font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20"
              >Folgt Dir</span>
            </div>
          </div>
          <div class="text-base font-medium text-center space-x-2 ">
            <storm-ui-button
              v-if="actor.viewer.following"
              icon="user-x"
              @click="onFollow"
            >
              Entfolgen
            </storm-ui-button>
            <storm-ui-button
              v-else
              icon="user-check"
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
          {{ formatInt(actor.followersCount) }} Folgende&nbsp;&nbsp;
          {{ formatInt(actor.followsCount) }} Folgt&nbsp;&nbsp;
          {{ formatInt(actor.postsCount) }} Posts
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
