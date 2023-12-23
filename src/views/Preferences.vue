<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { useSettingsStore, type IKeyValueStore } from '@/stores/SettingsStore.ts'
import { storeToRefs } from 'pinia'

const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)
const page = ref('app')
const formRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  await settingsStore.loadSettings()
})

const onSubmit = async (values: IKeyValueStore) => {
  await settingsStore.saveSettings(values)
}

const form = reactive(settings)

</script>

<template>
  <div class="p-4 py-8">
    <div class="flex">
      <storm-ui-segmented-control
        v-model="page"
        class=""
      >
        <storm-ui-segmented-control-item
          value="app"
          label="SkyTrails"
        />
        <storm-ui-segmented-control-item
          value="bsky"
          label="BlueSky-Einstellungen"
        />
        <storm-ui-segmented-control-item
          value="moderation"
          label="Moderation"
        />
      </storm-ui-segmented-control>
    </div>
    <storm-ui-form
      ref="formRef"
      class="space-y-3"
      :initial-values="form"
      @success="onSubmit"
    >
      <div class="p-4">
        <div class="text-lg font-medium mt-4">
          Schnellzugriff
        </div>
        <div class="flex items-center">
          <div class="flex-1 font-medium">
            Angepinnte Feeds immer anzeigen
          </div>
          <div class="flex-none">
            <storm-ui-switch
              name="showPinnedViews"
            />
          </div>
        </div>
        <div class="flex items-center">
          <div class="flex-1 font-medium">
            Listen immer anzeigen
          </div>
          <div class="flex-none">
            <storm-ui-switch
              name="showLists"
            />
          </div>
        </div>
        <div class="text-lg font-medium mt-4">
          Timeline
        </div>
        <div class="flex items-center">
          <div class="flex-1 font-medium">
            Antworten mit Kontext
          </div>
          <div class="flex-none">
            <storm-ui-switch
              name="answersWithContext"
            />
          </div>
        </div>
      </div>
      <storm-ui-button
        type="submit"
        variant="primary"
      >
        Speichern
      </storm-ui-button>
    </storm-ui-form>
  </div>
</template>
