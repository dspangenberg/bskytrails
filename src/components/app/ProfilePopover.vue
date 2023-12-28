<script setup lang="ts">
import { AppBskyActorDefs } from '@atproto/api'
import { onMounted, computed, ref } from 'vue'
import { id } from 'random-html-id'

import { useSkySessionStore } from '@/stores/SkySessionStore.ts'
import { useTemplateFilter } from '@/composables/useTemplateFilter.js'

const { formatInt } = useTemplateFilter()

const skySessionStore = useSkySessionStore()

const triggerId = computed(() => `input-${id()}`)
const popoverId = computed(() => `input-${id()}`)

type Author = AppBskyActorDefs.ProfileViewBasic

export interface Props {
  author: Author
}

const profile = ref()

const props = defineProps<Props>()

// initialize components based on data attribute selectors
onMounted(async () => {
  // profile.value = await skySessionStore.getProfile(props.author.did)
})

</script>

<template>
  <div>
    <storm-ui-avatar
      :id="triggerId"
      :data-popover-target="popoverId"
      class="mx-auto relative"
      :src="author.avatar"
      :alt="author.handle"
    />

    <div
      :id="popoverId"
      data-popover
      role="tooltip"
      class="absolute z-10 invisible inline-block w-96 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-600"
    >
      <div class="p-3">
        <div class="flex items-center justify-between mb-2 border">
          <a href="#">
            <storm-ui-avatar
              :src="author.avatar"
              :alt="author.handle"
            />
          </a>
          <div>
            <button
              type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Follow
            </button>
          </div>
        </div>
        <p class="text-base font-semibold leading-none text-gray-900 dark:text-white">
          <a href="#">{{ author.displayName || author.handle }}</a>
        </p>
        <p class="mb-3 text-sm font-normal">
          <a
            href="#"
            class="hover:underline"
          >@{{ author.handle }}</a>
        </p>
        <template v-if="profile">
          <p class="mb-4 text-base text-black text-justify hyphens-auto leading-snug pt-2">
            {{ profile?.description }}
          </p>
          <ul class="flex text-sm">
            <li class="mr-2">
              <a
                href="#"
                class="hover:underline"
              >
                <span class="font-semibold text-gray-900 dark:text-white pr-1">
                  {{ formatInt(profile.followsCount) }}
                </span>
                <span>Folge ich</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="hover:underline"
              >
                <span class="font-semibold text-gray-900 dark:text-white pr-1">
                  {{ formatInt(profile.followersCount) }}
                </span>
                <span>Follower</span>
              </a>
            </li>
          </ul>
        </template>
      </div>
      <div data-popper-arrow />
    </div>
  </div>
</template>
