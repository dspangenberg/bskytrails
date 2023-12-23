<script setup lang="ts">
import { AppBskyActorDefs } from '@atproto/api'
import { computed } from 'vue'

type AuthorDetailed = AppBskyActorDefs.ProfileViewDetailed

export interface Props {
  profile: AuthorDetailed | null
}

const props = defineProps<Props>()
const avatar = computed<string>(() => props.profile?.avatar || '')

</script>

<template>
  <div class="w-fullitems-center">
    <storm-ui-menu
      v-if="profile"
      origin="top"
    >
      <template #trigger>
        <button class="block  border-4  hover:border-gray-200 border-transparent my-1 rounded-md active:bg-gray-100 mx-auto">
          <storm-ui-avatar
            :src="avatar"
            :size="12"
            :alt="profile.handle"
          />
        </button>
      </template>
      <div>
        <storm-ui-menu-item
          disabled
          icon="tabler-user-circle"
          label="Mein Profil bearbeiten"
        />
        <storm-ui-menu-item
          disabled
          icon="tabler-password"
          label="Kennwort ändern"
        />
      </div>
    </storm-ui-menu>
  </div>
</template>
