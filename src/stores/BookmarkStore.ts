import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import { db, type Bookmark } from '@/db/index'
import { useSkySessionStore } from '@/stores/SkySessionStore.ts'

import { AppBskyFeedDefs } from '@atproto/api'
type PostView = AppBskyFeedDefs.PostView

export const useBookmarkStore = defineStore('sky-bookmark-store', () => {
  const bookmarks: Ref<Bookmark[] | null> = ref(null)
  const did: Ref<string> = ref('')
  const isLoading = ref(false)
  const bookmarkedCids = computed(() => bookmarks.value?.map(item => item.uri) || [])
  const skySessionStore = useSkySessionStore()

  const getBookmarks = async () => {
    did.value = skySessionStore.getCurrentDid()
    bookmarks.value = await db.bookmarks
      .where({ did: did.value })
      .reverse()
      .sortBy('bookmarkedAt')
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
      await db.bookmarks.add({
        did: did.value,
        uri: post.uri,
        indexedAt: post.indexedAt,
        bookmarkedAt: new Date().toISOString()
      })

      await getBookmarks()
    }
  }

  const removeBookmark = async (post: PostView | undefined) => {
    if (post !== undefined) {
      const bookmarkedPost = await db.bookmarks
        .where({ did: did.value, uri: post.uri })
        .first()
      if (bookmarkedPost?.id) {
        await db.bookmarks.delete(bookmarkedPost.id)
        await getBookmarks()
      }
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
