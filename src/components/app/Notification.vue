<script setup lang="ts">
import { AppBskyNotificationListNotifications } from '@atproto/api'
import { computed } from 'vue'
import ListViewItem from './ListViewItem.vue'
import PostProfileHoverCard from './PostProfileHoverCard.vue'
import NotificationContent from './NotificationContent.vue'
import { useRouter } from 'vue-router'

type Notification = AppBskyNotificationListNotifications.Notification

const router = useRouter()

 type Icon = {
  icon: string
  color: string
}

export interface Props {
  notification: Notification
}

const props = defineProps<Props>()

const goProfile = (handle: string) => {
  router.push({
    name: 'profile',
    params: {
      handle
    }
  })
}

const onJson = () => {
  console.log(props.notification)
}

const typeIcon = computed<Icon>(() => {
  switch (props.notification.reason) {
    case 'like':
      return {
        icon: 'heart-filled',
        color: 'text-red-500'
      } as Icon
    case 'follow':
      return {
        icon: 'butterfly',
        color: 'text-sky-500'
      } as Icon
    case 'reply':
      return {
        icon: 'message-circle-2-filled',
        color: 'text-blue-500'
      } as Icon
  }
  return {
    icon: 'message-circle-2-dots',
    color: 'text-gray-500'
  } as Icon
})

</script>

<template>
  <ListViewItem>
    <template #avatar>
      <PostProfileHoverCard
        :actor="notification.author"
      >
        <storm-ui-avatar
          v-if="notification.author"
          class="cursor-pointer mx-auto"
          :src="notification.author.avatar"
          :alt="notification.author.handle"
          :size="12"
          :icon="typeIcon.icon"
          :icon-color="typeIcon.color"
          @click="goProfile(notification.author.handle)"
        />
      </PostProfileHoverCard>
    </template>
    <template #title>
      <div
        v-if="notification.author"
        class="text-base text-black font-medium leading-normal flex-1 flex truncate"
      >
        {{ notification.author.displayName || notification.author.handle }}
      </div>
      <div
        class="flex flex-1 items-center leading-1"
      >
        <div
          v-if="notification.author?.displayName "
          class="flex-1 text-sm text-gray-500"
        >
          {{ notification.author.handle }}
        </div>
      </div>
    </template>
    <template #title-right>
      <storm-ui-time-ago
        v-tooltip="notification.indexedAt"
        :date="notification.indexedAt"
      />
    </template>
    <template #content>
      <NotificationContent
        v-if="notification.reasonSubject"
        :type="notification.reason"
        :record="notification?.record"
        :reason-subject="notification.reasonSubject"
      />
    </template>
    <template #footer>
      <div class="text-right flex-1 items-end flex">
        <div class="flex-1" />
        <div>
          <storm-ui-icon-button
            icon="code"
            @click="onJson"
          />
        </div>
      </div>
    </template>
  </ListViewItem>
</template>
