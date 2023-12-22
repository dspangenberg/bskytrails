import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import { db, type LocalSettings } from '@/db/index'
import { useSkySessionStore } from './SkySessionStore.ts'

interface IKeyValueStore {
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
    const value = await db.localSettings
      .where({ did: did.value, key })
      .first()
    return (useDefaultValue) ? value || defaultSettings[key] : value
  }

  const saveSettings = async (settings: IKeyValueStore) => {
    console.log(settings)
    const lSettings: IKeyValueStore | null = {}
    for (const [key, value] of Object.entries(settings)) {
      console.log(key, value)
      lSettings[key] = value
    }

    store.$patch((state) => {
      console.log(lSettings)
      state.settings = lSettings
    })
  }

  const loadSettings = async () => {
    const lSettings: IKeyValueStore = {}
    for (const [key] of Object.entries(defaultSettings)) {
      const value = await readSetting(key)
      console.log(key, value)
      lSettings[key] = value
    }
    settings.value = lSettings
  }

  return {
    loadSettings,
    saveSettings,
    settings
  }
})
