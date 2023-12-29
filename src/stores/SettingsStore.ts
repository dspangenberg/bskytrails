import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { useSkySessionStore } from './SkySessionStore.ts'
import PouchDB from 'pouchdb'
import PouchDBUpsert from 'pouchdb-upsert'
import PouchDBFind from 'pouchdb-find'

export type IKeyValueStore = {
  [key: string]: string | boolean | number
}

type Setting = {
  did: string,
  key: string
  value: string | boolean | number
}

type FindResponse<T> = {
  docs: T[]
  warning?: string
}

PouchDB.plugin(PouchDBUpsert)
PouchDB.plugin(PouchDBFind)

const db = new PouchDB<Setting>('settings')

export const useSettingsStore = defineStore('sky-settings-store', () => {
  const skySessionStore = useSkySessionStore()
  const did: Ref<string> = ref('')
  const store = useSettingsStore()

  did.value = skySessionStore.getCurrentDid()

  const defaultSettings: IKeyValueStore = {
    showPinnedFeeds: true,
    showLists: true,
    answersWithContext: true
  }

  const settings = ref<IKeyValueStore | null>(null)

  const readSetting = async (key: string, useDefaultValue: boolean = true) => {
    const { docs }: FindResponse<Setting> = await db.find({
      selector: {
        did: { $eq: did.value },
        key: { $eq: key }
      }
    })

    if (docs[0]) {
      return docs[0].value
    } else {
      return (useDefaultValue) ? defaultSettings[key] : null
    }
  }

  const saveSettings = async (settings: IKeyValueStore) => {
    const lSettings: IKeyValueStore | null = {}
    for (const [key, value] of Object.entries(settings)) {
      lSettings[key] = value
      const _id = `${did.value}-${key}`
      await db.upsert(_id, () => {
        return {
          did: did.value,
          key,
          value
        }
      })
    }

    store.$patch((state) => {
      state.settings = lSettings
    })
  }

  const loadSettings = async () => {
    const lSettings: IKeyValueStore = {}
    for (const [key] of Object.entries(defaultSettings)) {
      const value = await readSetting(key)
      if (value !== undefined && value !== null) {
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
