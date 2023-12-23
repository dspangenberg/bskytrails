<script setup lang="ts">
import { type Profile, useSkySessionStore } from '@/stores/SkySessionStore.ts'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/SettingsStore.ts'
import { useSkyTimelineStore } from '@/stores/SkyTimelineStore.ts'

const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)
const timelineStore = await useSkyTimelineStore()
const { timelineUpdated } = storeToRefs(timelineStore)

const route = useRoute()
export interface Props {
  profile: Profile | null
}

const skySessionStore = useSkySessionStore()
const { unreadNotificationsCounter, pinnedFeeds, isLoadingFeeds, lists, isLoadingLists, profile: storeProfile, isLoadingProfile } = storeToRefs(skySessionStore)

defineProps<Props>()

const isMyProfile = computed(() => {
  const profile = storeProfile.value || null
  if (profile && route.name === 'profile') {
    return profile.handle === route.params?.handle
  }
  return false
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
              :badge-count="timelineUpdated"
              badge-color="green"
              :loading="isLoadingFeeds || isLoadingLists"
              label="Start"
              icon="butterfly"
              route-name="home"
              active-route-path="/home"
            />
            <storm-ui-nav-item
              :open="settings?.showPinnedViews"
              label="Feeds"
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
              :open="settings?.showLists"
              :disabled="!profile"
              label="Listen"
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
              label="Lesezeichen"
              icon="tabler-bookmark"
              route-name="bookmarks"
              active-route-path="/bookmarks"
            />
          </storm-ui-nav-group>
          <storm-ui-nav-group>
            <storm-ui-nav-item
              :active="isMyProfile"
              label="Profil"
              icon="tabler-user-square-rounded"
              route-name="profile"
              :route-params="{ handle: profile?.handle }"
            />
            <storm-ui-nav-item
              label="Benachrichtigungen"
              icon="tabler-notification"
              :badge-count="unreadNotificationsCounter"
              badge-animate
              badge-color="red"
              route-name="notifications"
              active-route-path="/notifications"
            />

            <storm-ui-nav-item
              label="Präferenzen"
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
      <div class="flex-none p-4 flex items-center ">
        <div class="flex-none">
          <storm-ui-icon
            name="butterfly"
            class="h-6 w-6 text-sky-600 rotate-90 mr-1"
            :stroke-width="1.5"
          />
        </div>
        <div class="text-stone-700 flex-1">
          vlinder
        </div>
        <div class="flex-none space-x-2 flex items-center">
          <AppLanguageMenu />
        </div>
      </div>
    </div>
  </nav>
</template>
