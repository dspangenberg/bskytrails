import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AtUri, AppBskyFeedDefs } from '@atproto/api'
import { useSkySessionStore } from './SkySessionStore.ts'

import { set, unset, uniqBy } from 'lodash'
import { useBookmarkStore } from '@/stores/BookmarkStore.ts'
import sortOn from 'sort-on'

type FeedPost = AppBskyFeedDefs.FeedViewPost
type PostView = AppBskyFeedDefs.PostView

type Agent = any

export type ViewTimline = {
  view: string,
  cursor?: string | null,
  feed: FeedPost[] | null
}

export type CachedPosts = {
  [key: string]: FeedPost[]
}

export const useSkyTimelineStore = defineStore('sky-timeline-store', () => {
  const skySessionStore = useSkySessionStore()
  const bookmarkStore = useBookmarkStore()

  const agent = ref<Agent | null>(null)

  const viewTimeline = ref<ViewTimline| null>(null)

  const store = useSkyTimelineStore()

  const isLoading = ref(false)

  const feed = ref()
  const list = ref()
  const lastCursor = ref<string | null>(null)
  const limit = ref<number>(10)
  const feedType = ref<string | undefined>(undefined)
  const oldParam = ref<string | null>(null)
  const cachedPosts = ref<CachedPosts>({})
  const newestPost = ref<string | null>(null)
  const timelineUpdated = ref<boolean>(false)
  const newTimelinePosts = ref<FeedPost[]>([])
  const timelineRefreshed = ref<string>('')

  type FeedParams = {
    key?: string
    limit?: number
    thread?: string
    value?: string
    uri?: string
    list?: string
    feed?: string
    actor?: string
    cursor?: string
  }

  const getKeyByType = (type: string) => {
    switch (type) {
      case 'actor':
        return 'actor'
      case 'thread':
        return 'uri'
      case 'feed':
        return 'feed'
      case 'list':
        return 'list'
      default:
        return undefined
    }
  }

  const pollTimeline = async () => {
    agent.value = await skySessionStore.getAgent()
    const { data, success } = await agent.value.getTimeline({ limit: 1 })
    if (success && data.feed[0]?.post) {
      const newPost: string = data.feed[0].post.uri
      if (newestPost.value !== null && newPost !== newestPost.value) {
        if (!newTimelinePosts.value.find(item => item.post?.uri === newPost)) {
          newTimelinePosts.value.push(data.feed[0])
        }

        store.$patch((state) => {
          state.timelineUpdated = true
        })
      } else {
        newestPost.value = newPost
      }
    }
  }

  const getTimelineByView = async (type: string, value?: string, cursor?: string, loadMore: boolean = false) => {
    feedType.value = type

    if (!loadMore) {
      store.$patch((state) => {
        state.isLoading = true
      })
    }

    if (value !== undefined && value !== null) {
      oldParam.value = value
    }

    agent.value = await skySessionStore.getAgent()

    const key = getKeyByType(type)

    const params: FeedParams = {
      limit: cursor ? 5 : limit.value
    }

    if (key !== undefined && value !== undefined) {
      params[key] = value
    }

    if (cursor) {
      params.cursor = cursor
    }

    const data: ViewTimline | null = null

    switch (type) {
      case 'timeline':
        await getTimeline(params, loadMore)
        break
      case 'feed':
        await getTimelineFeed(params)
        break
      case 'actor':
        await getActorTimeline(params)
        break
      case 'list':
        await getListFeed(params)
        break
      case 'thread':
        await getThreadTimeline(params)
        break
      case 'bookmarks':
        await getBookmarksFeed()
    }

    store.$patch((state) => {
      state.viewTimeline = viewTimeline.value
    })

    if (cursor) {
      lastCursor.value = cursor
      return data
    }
  }

  const loadMore = async (cursor: string) => {
    if (lastCursor.value !== cursor) {
      const type = feedType.value
      if (type) {
        await getTimelineByView(type, oldParam.value || undefined, cursor, true)
        setCachedPosts()
      }
    }
  }

  const setCachedPosts = () => {
    if (viewTimeline.value && viewTimeline.value.feed) {
      cachedPosts.value[viewTimeline.value.view] = viewTimeline.value.feed.slice(1, 10)
    }
  }

  const getCachedPosts = (view: string) => {
    if (cachedPosts.value[view]?.length) {
      store.$patch((state) => {
        state.isLoading = false
      })
      return cachedPosts.value[view]
    }
    return null
  }

  const mergeFeed = (feeds: FeedPost[]) => {
    let merged: FeedPost[]
    if (viewTimeline.value?.feed?.length) {
      merged = viewTimeline.value.feed.concat(feeds)
    } else {
      merged = feeds
    }
    merged = uniqBy(merged, 'post.uri').map(item => {
      item.sortOn = item.reason ? item.reason.indexedAt : item.post.indexedAt
      return item
    })
    return sortOn(merged, '-sortOn')
  }

  const updateViewTimeline = (view: string, cursor: string | null = null, feed: FeedPost[] | null = null) => {
    viewTimeline.value = {
      view,
      cursor,
      feed
    }
    if (feed) setCachedPosts()
  }

  const setViewTimeline = (view: string, cursor: string | null) => {
    let existingPosts: FeedPost[] | null = null

    if (viewTimeline.value?.view === view) {
      existingPosts = viewTimeline.value?.feed
    } else {
      existingPosts = getCachedPosts(view) || []
    }

    if (existingPosts) {
      updateViewTimeline(view, cursor, existingPosts)
    } else {
      updateViewTimeline(view)
    }
  }

  const getTimeline = async (params: FeedParams, loadMore: boolean = false) => {
    const viewName = 'timeline'
    if (!loadMore) {
      store.$patch((state) => {
        state.timelineUpdated = false
        state.newTimelinePosts = []
      })
    }

    setViewTimeline(viewName, params.cursor || null)

    newestPost.value = null
    timelineUpdated.value = false
    const { data, success } = await agent.value.getTimeline(params)
    if (success) {
      updateViewTimeline(viewName, data.cursor, mergeFeed(data.feed))
      store.$patch((state) => {
        state.isLoading = false
      })
    }
  }

  const refreshTimeline = () => {
    if (viewTimeline.value?.view === 'timeline' && newTimelinePosts.value.length) {
      const feed = mergeFeed(newTimelinePosts.value)
      store.$patch((state) => {
        if (state.viewTimeline?.feed) {
          state.viewTimeline.feed = feed
          state.newTimelinePosts = []
          state.timelineUpdated = false
          state.timelineRefreshed = new Date().toISOString()
          state.newestPost = null
        }
        setCachedPosts()
      })
    }
  }

  const getActorTimeline = async (params: FeedParams) => {
    const viewName = `actor-${params.actor}`
    setViewTimeline(viewName, params.cursor || null)

    const { data, success } = await agent.value.getAuthorFeed(params)
    if (success) {
      updateViewTimeline(viewName, data.cursor, mergeFeed(data.feed))
      store.$patch((state) => {
        state.isLoading = false
      })
    }
  }

  const getListFeed = async (params: FeedParams) => {
    if (params.list) {
      params.list = new AtUri(params.list).href
      await getListDetails(params.list)
    }
    const viewName = `list-${params.list}`
    setViewTimeline(viewName, params.cursor || null)

    const { data, success } = await agent.value.app.bsky.feed.getListFeed(params)
    if (success) {
      updateViewTimeline(viewName, data.cursor, mergeFeed(data.feed))
      store.$patch((state) => {
        state.isLoading = false
      })
    }
  }

  const getTimelineFeed = async (params: FeedParams) => {
    if (params.feed) {
      params.feed = new AtUri(params.feed).href
    }
    const viewName = `feed-${params.feed}`
    setViewTimeline(viewName, params.cursor || null)

    const { data, success } = await agent.value.app.bsky.feed.getFeed(params)
    if (success) {
      updateViewTimeline(viewName, data.cursor, mergeFeed(data.feed))
      store.$patch((state) => {
        state.isLoading = false
      })
    }
  }

  const getBookmarksFeed = async () => {
    const posts = await bookmarkStore.getBookmarkedPosts() as FeedPost[]
    isLoading.value = false
    const data: ViewTimline = {
      view: 'feed-bookmarks',
      cursor: '',
      feed: posts
    }
    store.$patch((state) => {
      state.viewTimeline = data
    })
    return data
  }

  const getThreadTimeline = async (params: FeedParams) => {
    if (params.uri) {
      params.uri = new AtUri(params.uri).href
    }
    delete params.limit
    const { data, success } = await agent.value.getPostThread(params)
    isLoading.value = false
    if (success) {
      data.thread.replies.unshift({ post: data.thread.post })
      store.$patch((state) => {
        state.viewTimeline = {
          view: 'thread',
          cursor: undefined,
          feed: data.thread.replies
        }
      })
    }
    return null
  }

  const postToggleLike = async (post: PostView | undefined) => {
    if (post !== undefined) {
      const isLiked = !!post?.viewer?.like
      const result = isLiked ? await agent.value.deleteLike(post.viewer?.like) : await agent.value.like(post.uri, post.cid)

      let likeCount = post.likeCount || 0
      if (isLiked) {
        likeCount--
      } else {
        likeCount++
      }

      updatePostInTimeline(post.uri, 'viewer.like', result ? result.uri : undefined)
      updatePostInTimeline(post.uri, 'likeCount', likeCount)
    }
  }

  const postToggleRepost = async (post: PostView | undefined) => {
    if (post !== undefined) {
      const isReposted = !!post.viewer?.repost
      const result = isReposted ? await agent.value.deleteRepost(post.viewer?.repost) : await agent.value.repost(post.uri, post.cid)

      let repostCount = post.repostCount || 0
      if (isReposted) {
        repostCount--
      } else {
        repostCount++
      }

      updatePostInTimeline(post.uri, 'viewer.repost', result ? result.uri : undefined)
      updatePostInTimeline(post.uri, 'repostCount', repostCount || 0)
    }
  }

  const getFeedDetails = async (uri: string) => {
    feed.value = null
    agent.value = await skySessionStore.getAgent()
    uri = new AtUri(uri).href
    const { success, data } = await agent.value.app.bsky.feed.getFeedGenerator({ feed: uri })
    if (success) {
      feed.value = data.view
    }
  }

  const getListDetails = async (uri: string) => {
    list.value = skySessionStore?.lists?.find(item => item.uri === uri)
  }

  const updatePostInTimeline = (uri: string, key: string, value: string | number | undefined) => {
    const index = viewTimeline.value?.feed?.findIndex(item => item.post.uri === uri)
    if (index !== undefined && index !== -1) {
      store.$patch((state) => {
        if (state.viewTimeline?.feed) {
          const post = state.viewTimeline?.feed[index].post
          if (value) {
            set(post, key, value)
          } else {
            unset(post, key)
          }
        }
      })
    }
  }

  return {
    cachedPosts,
    feed,
    isLoading,
    list,
    timelineRefreshed,
    feedType,
    loadMore,
    newTimelinePosts,
    newestPost,
    viewTimeline,
    refreshTimeline,
    pollTimeline,
    getFeedDetails,
    getListDetails,
    getTimelineByView,
    postToggleLike,
    postToggleRepost,
    timelineUpdated
  }
})
