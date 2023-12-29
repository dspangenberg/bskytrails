import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import { useSkySessionStore } from '@/stores/SkySessionStore.ts'
import PouchDB from 'pouchdb'
import PouchDBUpsert from 'pouchdb-upsert'
import PouchDBFind from 'pouchdb-find'
import { AppBskyFeedDefs } from '@atproto/api'
import sortOn from 'sort-on'

type PostView = AppBskyFeedDefs.PostView

type Bookmark = {
  id?: number
  did: string
  uri: string
  bookmarkedAt: string
  indexedAt: string
}

type FindResponse<T> = {
  docs: T[]
  warning?: string
}

export const useBookmarkStore = defineStore('sky-bookmark-store', () => {
  const bookmarks: Ref<Bookmark[] | null> = ref(null)
  const did: Ref<string> = ref('')
  const isLoading = ref(false)
  const bookmarkedCids = computed(() => bookmarks.value?.map(item => item.uri) || [])
  const skySessionStore = useSkySessionStore()

  PouchDB.plugin(PouchDBUpsert)
  PouchDB.plugin(PouchDBFind)

  const db = new PouchDB<Bookmark>('bookmarks')

  const getBookmarks = async () => {
    did.value = skySessionStore.getCurrentDid()
    const { docs }: FindResponse<Bookmark> = await db.find({
      selector: {
        did: { $eq: did.value }
      }
    })

    bookmarks.value = sortOn(docs, '-bookmarkedAt')
    return bookmarks.value
  }

  const getBookmarkedPosts = async () => {
    did.value = skySessionStore.getCurrentDid()

    const posts = await getBookmarks()
    const postUris = posts.map(item => item.uri)
    const feed = await skySessionStore.getPosts(postUris)
    return feed
  }

  const addBookmark = async (post: PostView | undefined) => {
    if (post !== undefined) {
      did.value = skySessionStore.getCurrentDid()

      await db.upsert(post.uri, () => {
        return {
          did: did.value,
          uri: post.uri,
          indexedAt: post.indexedAt,
          bookmarkedAt: new Date().toISOString()
        }
      })

      await getBookmarks()
    }
  }

  const removeBookmark = async (post: PostView | undefined) => {
    if (post !== undefined) {
      const doc = await db.get(post.uri)
      db.remove(doc)
      await getBookmarks()
    }
  }

  return {
    bookmarks,
    bookmarkedCids,
    did,
    isLoading,
    addBookmark,
    getBookmarks,
    getBookmarkedPosts,
    removeBookmark
  }
})
