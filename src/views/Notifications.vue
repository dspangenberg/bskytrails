<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSkySessionStore } from '@/stores/SkySessionStore.ts'
import { useInfiniteScroll } from '@vueuse/core'
import Notification from '@/components/app/Notification.vue'

const el = ref<HTMLElement | null>(null)
const skySessionStore = useSkySessionStore()

const { notificationView } = storeToRefs(skySessionStore)

useInfiniteScroll(
  el,
  async () => {
    await skySessionStore.getNotifications()
  }
)

onMounted(async () => {
  await skySessionStore.getNotifications()
  await skySessionStore.updateSeenNotifications()
})

</script>
<template>
  <div class="flex flex-1 h-full items-stretch">
    <ul
      v-if="notificationView?.notifications?.length"
      ref="el"
      class="divide-y px-0 mx-0 h-full flex flex-col flex-1 overflow-y-auto overflow-x-hidden"
    >
      <Notification
        v-for="(notification, index) in notificationView.notifications"
        :key="index"
        :notification="notification"
      />
    </ul>
  </div>
</template>
