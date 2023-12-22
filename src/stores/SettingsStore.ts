import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { db, type LocalSettings } from '@/db/index'
import { useSkySessionStore } from './SkySessionStore.ts'

export type IKeyValueStore = {
  [key: string]: string | boolean | number
}

export const useSettingsStore = defineStore('sky-settings-store', () => {
  const skySessionStore = useSkySessionStore()
  const did: Ref<string> = ref('')
  const store = useSettingsStore()

  did.value = skySessionStore.getCurrentDid()

  const defaultSettings: IKeyValueStore = {
    showPinnedViews: true,
    showLists: true,
    answersWithContext: true
  }

  const settings = ref<IKeyValueStore | null>(null)

  const readSetting = async (key: string, useDefaultValue: boolean = true) => {
    const record: LocalSettings | undefined = await db.localSettings
      .where({ did: did.value, key })
      .first()

    if (record !== undefined && record?.value) {
      return record.value
    } else {
      return (useDefaultValue) ? defaultSettings[key] : null
    }
  }

  const saveSettings = async (settings: IKeyValueStore) => {
    const lSettings: IKeyValueStore | null = {}
    for (const [key, value] of Object.entries(settings)) {
      lSettings[key] = value
    }

    store.$patch((state) => {
      state.settings = lSettings
    })
  }

  const loadSettings = async () => {
    const lSettings: IKeyValueStore = {}
    for (const [key] of Object.entries(defaultSettings)) {
      const value = await readSetting(key)
      if (value !== null) {
        lSettings[key] = value
      }
    }
    settings.value = lSettings
  }

  return {
    loadSettings,
    saveSettings,
    settings
  }
})
