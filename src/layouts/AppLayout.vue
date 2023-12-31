<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSkySessionStore } from '@/stores/SkySessionStore.ts'
import Navigation from './components/Navigation.vue'
import TimelineHeader from './components/TimelineHeader.vue'
import { useSettingsStore } from '@/stores/SettingsStore.ts'
import { useOnline, useTimeoutPoll } from '@vueuse/core'
import { useSkyTimelineStore } from '@/stores/SkyTimelineStore.ts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  useScope: 'global'
})

const skySessionStore = useSkySessionStore()
const timelineStore = await useSkyTimelineStore()

const fetchData = async () => {
  await skySessionStore.getUnreadNotificationsCount()
  await timelineStore.pollTimeline()
}

const { resume } = useTimeoutPoll(fetchData, 10000)

const isOnline = useOnline()

const route = useRoute()
const settingsStore = useSettingsStore()

const { profile } = storeToRefs(skySessionStore)
const title = computed(() => {
  switch (route.name) {
    case 'bookmarks':
      return 'Lesezeichen'
    case 'profile':
      return 'Profil'
    case 'thread':
      return 'Thread'
    case 'feeds-timeline':
      return 'Feed'
    case 'lists-feed':
      return 'Liste'
    case 'preferences':
      return 'Präferenzen'
    case 'notifications':
      return 'Benachrichtigungen'
    default:
      return 'Bluesky'
  }
})

onMounted(async () => {
  await skySessionStore.getMyProfile()
  await settingsStore.loadSettings()
  resume()
})

</script>
<template>
  <div class="min-h-screen flex flex-col h-screen bg-stone-50  border-stone-100">
    <div class="flex-1 flex flex-row overflow-y-hidden mx-auto">
      <main class="flex-1 bg-white w-[600px] border-l border-r flex flex-col">
        <div v-if="!isOnline">
          <div
            id="alert-border-2"
            class="flex items-center p-4 border-b text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800"
            role="alert"
          >
            <svg
              class="flex-shrink-0 w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <div class="ms-3 text-sm font-medium">
              t('misc.messages.offline')
            </div>
            <button
              type="button"
              class="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
              data-dismiss-target="#alert-border-2"
              aria-label="Close"
            />
          </div>
        </div>
        <TimelineHeader
          :title="title"
          :type="route?.name || null"
        />

        <div class="flex-1 scroll-smooth  scrollbar-thin overflow-y-auto overflow-x-hidden">
          <router-view />
        </div>
      </main>
      <Navigation :profile="profile" />
      <aside class="sm:w-32  overflow-y-auto w-64 flex-none" />
    </div>
  </div>
</template>
