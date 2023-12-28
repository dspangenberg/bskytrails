<script setup lang="ts">
import { type Profile, useSkySessionStore } from '@/stores/SkySessionStore.ts'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { computed, watch } from 'vue'
import { useSettingsStore } from '@/stores/SettingsStore.ts'
import { useSkyTimelineStore } from '@/stores/SkyTimelineStore.ts'
import { useSound } from '@vueuse/sound'
import notificationSound from '@/assets/sounds/Glass_Rise1.wav'

const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)
const timelineStore = await useSkyTimelineStore()
const { timelineUpdated } = storeToRefs(timelineStore)

const { play: playNotificationSound } = useSound(notificationSound)

const route = useRoute()
export interface Props {
  profile: Profile | null
}

const skySessionStore = useSkySessionStore()
const { unreadNotificationsCounter, pinnedFeeds, isLoadingFeeds, lists, isLoadingLists, profile: storeProfile } = storeToRefs(skySessionStore)

defineProps<Props>()

const isMyProfile = computed(() => {
  const profile = storeProfile.value || null
  if (profile && route.name === 'profile') {
    return profile.handle === route.params?.handle
  }
  return false
})

watch(unreadNotificationsCounter, async (newCounter: number, oldCounter: number) => {
  if (newCounter > oldCounter) {
    await playNotificationSound()
  }
})

const feedParams = (uri: string) => {
  const parts = uri.replace('at://', '').split('/')
  const params = {
    uri: parts[0],
    type: parts[1],
    name: parts[2]
  }
  return params
}

const activeRoute = (name: string, uri: string) => {
  const parts = uri.replace('at://', '').split('/')
  return '/' + name + '/' + parts.join('/')
}

</script>

<template>
  <nav class="order-first  overflow-y-auto w-64 flex-none h-full flex flex-col">
    <div class="flex-1 flex flex-col">
      <div
        class="mt-12 space-y-4 flex-1"
      >
        <template v-if="profile">
          <app-account-button :profile="profile" />
          <storm-ui-nav-group>
            <storm-ui-nav-item
              i18n
              :badge-count="timelineUpdated"
              badge-color="green"
              :loading="isLoadingFeeds || isLoadingLists"
              label="navigation.home"
              icon="butterfly"
              route-name="home"

              active-route-path="/home"
            />
            <storm-ui-nav-item
              i18n
              :open="settings?.showPinnedViews"
              label="navigation.feeds"
              icon="message-2-heart"
              route-name="feeds"
              active-route-path="/feed"
            >
              <storm-ui-sub-nav-item
                v-for="feed in pinnedFeeds"
                :key="feed.uri"
                class="animate-in fade-in  duration-150"
                :label="feed.displayName"
                route-name="feeds-timeline"
                :route-params="feedParams(feed.uri)"
                :active-route-path="activeRoute('feed', feed.uri)"
              />
            </storm-ui-nav-item>
            <storm-ui-nav-item
              i18n
              :open="settings?.showLists"
              :disabled="!profile"
              label="navigation.lists"
              icon="tabler-list-details"
              route-name="profile"
              :route-params="{ handle: profile?.handle }"
              active-route-path="/list"
            >
              <storm-ui-sub-nav-item
                v-for="list in lists"
                :key="list.uri"
                class="animate-in fade-in"
                :label="list.name"
                route-name="list-feed"
                :route-params="feedParams(list.uri)"
                :active-route-path="activeRoute('list', list.uri)"
              />
            </storm-ui-nav-item>
            <storm-ui-nav-item
              i18n
              label="navigation.bookmarks"
              icon="tabler-bookmark"
              route-name="bookmarks"
              active-route-path="/bookmarks"
            />
          </storm-ui-nav-group>
          <storm-ui-nav-group>
            <storm-ui-nav-item
              i18n
              :active="isMyProfile"
              label="navigation.profile"
              icon="tabler-user-square-rounded"
              route-name="profile"
              :route-params="{ handle: profile?.handle }"
            />
            <storm-ui-nav-item
              i18n
              label="navigation.notifications"
              icon="tabler-notification"
              :badge-count="unreadNotificationsCounter"
              badge-animate
              badge-color="red"
              route-name="notifications"
              active-route-path="/notifications"
            />

            <storm-ui-nav-item
              i18n
              label="navigation.preferences"
              icon="tabler-adjustments-alt"
              route-name="preferences"
              active-route-path="/preferences"
            />

            <storm-ui-nav-item
              class="hidden"
              disabled
              label="Bubble"
              icon="tabler-chart-bubble"
              route-name="home"
              active-route-path="/homex"
            />
            <storm-ui-nav-item
              class="hidden"
              label="Favoriten"
              icon="tabler-heart"
              route-name="home"
              active-route-path="/homex"
            />
          </storm-ui-nav-group>
          <storm-ui-nav-group
            class="hidden"
          >
            <storm-ui-nav-item
              label="Trends"
              icon="tabler-trending-up"
              route-name="home"
              active-route-path="/trends"
            />
          </storm-ui-nav-group>
        </template>
      </div>
      <div class="flex-none p-4 flex items-end ">
        <div class="flex-none">
          <storm-ui-icon
            name="butterfly"
            class="h-8 w-8 text-sky-600 mr-1"
            :stroke-width="1.2"
          />
        </div>
        <div class="text-stone-700 flex-1">
          papillon
        </div>
        <div class="flex-none space-x-2 flex items-end">
          <AppLanguageMenu />
        </div>
      </div>
    </div>
  </nav>
</template>
