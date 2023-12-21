<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSkySessionStore } from '@/stores/SkySessionStore.ts'
import Navigation from './components/Navigation.vue'
import TimelineHeader from './components/TimelineHeader.vue'

const route = useRoute()
const skySessionStore = useSkySessionStore()

const { profile } = storeToRefs(skySessionStore)

onMounted(async () => {
  await skySessionStore.getMyProfile()
})

</script>
<template>
  <div class="min-h-screen flex flex-col h-screen bg-stone-50  border-stone-100">
    <div class="flex-1 flex flex-row overflow-y-hidden mx-auto">
      <main class="flex-1 bg-white w-[600px] border-l border-r flex flex-col">
        <TimelineHeader
          title="Start"
          :type="route.name"
        />
        <Suspense>
          <div class="flex-1 scroll-smooth  scrollbar-thin overflow-y-auto overflow-x-hidden">
            <router-view />
          </div>

          <template #fallback>
            <div
              class="flex items-center justify-center  flex-1"
            >
              <storm-ui-spinner
                :size="12"
              />
            </div>
          </template>
        </Suspense>
      </main>
      <Navigation :profile="profile" />
      <aside class="sm:w-32  overflow-y-auto w-64 flex-none" />
    </div>
  </div>
</template>
