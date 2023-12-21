import Dexie, { type Table } from 'dexie'

export interface Bookmark {
  id?: number
  did: string
  uri: string
  bookmarkedAt: string
  indexedAt: string
}

export interface LocalSettings {
  id?: number
  did: string
  key: string
  value: string
}

export class SkytrailsDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  bookmarks!: Dexie.Table<Bookmark, number>
  localSettings!: Dexie.Table<LocalSettings, number>

  constructor () {
    super('skytrails')
    this.version(6).stores({
      bookmarks: '++id, [did+uri], did, uri, bookmarkedAt, indexedAt', // Primary key and indexed props
      localSettings: '++id, [did+key], did, key' // Primary key and indexed props
    })
  }
}

export const db = new SkytrailsDexie()
