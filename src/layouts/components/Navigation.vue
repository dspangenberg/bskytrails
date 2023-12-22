<script setup lang="ts">
import { type Profile, useSkySessionStore } from '@/stores/SkySessionStore.ts'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/SettingsStore.ts'

const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)

const route = useRoute()
export interface Props {
  profile: Profile | null
}

const skySessionStore = useSkySessionStore()
const { pinnedFeeds, isLoadingFeeds, isLoadingProfile, lists, isLoadingLists } = storeToRefs(skySessionStore)

defineProps<Props>()

const isMyProfile = computed(() => route.name === 'profile' && skySessionStore.profile.value?.handle === route.params.handle)

const feedParams = (uri: string) => {
  const parts = uri.replace('at://', '').split('/')
  const params = {
    uri: parts[0],
    type: parts[1],
    name: parts[2]
  }
  return params
}

</script>

<template>
  <nav class="order-first  overflow-y-auto w-64 flex-none h-full flex flex-col">
    <div class="flex-1">
      <div
        v-if="profile"
        class="mt-12 space-y-4"
      >
        <app-account-button :profile="profile" />
        <storm-ui-nav-group>
          <storm-ui-nav-item
            badge-animate
            :badge-count="4"
            badge-color="green"
            label="Start"
            icon="home"
            route-name="home"
            active-route-path="/home"
          />
          <storm-ui-nav-item
            :open="settings?.showPinnedViews"
            label="Feeds"
            icon="message-2-heart"
            route-name="feeds"
            :loading="isLoadingFeeds"
            active-route-path="/feed"
          >
            <storm-ui-sub-nav-item
              v-for="feed in pinnedFeeds"
              :key="feed.uri"
              :label="feed.displayName"
              route-name="feeds-timeline"
              :route-params="feedParams(feed.uri)"
            />
          </storm-ui-nav-item>
          <storm-ui-nav-item
            :open="settings?.showLists"
            :disabled="!profile"
            :loading="isLoadingLists"
            label="Listen"
            icon="tabler-list-details"
            route-name="profile"
            :route-params="{ handle: profile?.handle }"
            active-route-path="/list"
          >
            <storm-ui-sub-nav-item
              v-for="list in lists"
              :key="list.uri"
              :label="list.name"
              route-name="list-feed"
              :route-params="feedParams(list.uri)"
            />
          </storm-ui-nav-item>
        </storm-ui-nav-group>
        <storm-ui-nav-group>
          <storm-ui-nav-item
            :active="isMyProfile"
            label="Mein Profil"
            icon="tabler-user-circle"
            route-name="profile"
            :route-params="{ handle: profile?.handle }"
          />
          <storm-ui-nav-item
            label="Benachrichtigungen"
            icon="tabler-notification"
            route-name="home"
            active-route-path="/homex"
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
          <storm-ui-nav-item
            label="Lesezeichen"
            icon="tabler-bookmark"
            route-name="bookmarks"
            active-route-path="/bookmarks"
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
      </div>
    </div>
  </nav>
</template>
