import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AtUri, AppBskyFeedDefs } from '@atproto/api'
import { useSkySessionStore } from './SkySessionStore.ts'

import { set, unset } from 'lodash'

type FeedPost = AppBskyFeedDefs.FeedViewPost
type PostView = AppBskyFeedDefs.PostView

type Agent = any

export type ViewTimline = {
  view: string,
  cursor?: string | null,
  feed: FeedPost[] | null
}

export const useSkyTimelineStore = defineStore('sky-timeline-store', () => {
  const skySessionStore = useSkySessionStore()
  const agent = ref<Agent | null>(null)

  const viewTimeline = ref<ViewTimline| null>(null)

  const store = useSkyTimelineStore()

  const isLoading = ref(false)

  const feed = ref()
  const lastCursor = ref<string | null>(null)
  const limit = ref<number>(10)
  const feedType = ref<string | undefined>(undefined)
  const oldParam = ref<string | null>(null)

  type FeedParams = {
    key?: string
    limit?: number
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

  const getTimelineByView = async (type: string, value?: string, cursor?: string) => {
    feedType.value = type

    if (cursor === undefined) {
      isLoading.value = true
    }

    if (value !== undefined && value !== null) {
      oldParam.value = value
    }

    agent.value = await skySessionStore.getAgent()

    const key = getKeyByType(type)

    const params: FeedParams = {
      limit: limit.value
    }

    if (key !== undefined && value !== undefined) {
      params[key] = value
    }

    if (cursor) {
      params.cursor = cursor
    }

    let data: ViewTimline | null = null

    switch (type) {
      case 'timeline':
        data = await getTimeline(params)
        break
      case 'feed':
        data = await getTimelineFeed(params)
        break
      case 'actor':
        data = await getActorTimeline(params)
        break
      case 'list':
        data = await getListFeed(params)
        break
      case 'thread':
        data = await getThreadTimeline(params)
        break
    }

    if (cursor) {
      lastCursor.value = cursor
      return data
    }

    if (data) {
      store.$patch((state) => {
        state.viewTimeline = data
      })
    }

    isLoading.value = false
  }

  const loadMore = async (cursor: string) => {
    if (lastCursor.value !== cursor) {
      const type = feedType.value
      if (type) {
        const loadedData = await getTimelineByView(type, oldParam.value || undefined, cursor)
        if (Array.isArray(loadedData?.feed)) {
          store.$patch((state) => {
            if (state.viewTimeline) {
              state.viewTimeline.cursor = loadedData?.cursor || null
            }
            if (Array.isArray(loadedData?.feed)) {
              for (const item of loadedData.feed) {
                state.viewTimeline?.feed?.push(item)
              }
            }
          })
        }
      }
    }
  }

  const getTimeline = async (params: FeedParams) => {
    const { data, success } = await agent.value.getTimeline(params)
    if (success) {
      return {
        view: 'timeline',
        cursor: data.cursor,
        feed: data.feed
      }
    }
    return null
  }

  const getActorTimeline = async (params: FeedParams) => {
    const { data, success } = await agent.value.getAuthorFeed(params)
    if (success) {
      return {
        view: `actor-${params.actor}`,
        cursor: data.cursor,
        feed: data.feed
      }
    }
    return null
  }

  const getListFeed = async (params: FeedParams) => {
    if (params.list) {
      params.list = new AtUri(params.list).href
    }
    const { data, success } = await agent.value.app.bsky.feed.getListFeed(params)
    if (success) {
      return {
        view: `actor-${params.actor}`,
        cursor: data.cursor,
        feed: data.feed
      }
    }
    return null
  }

  const getTimelineFeed = async (params: FeedParams) => {
    if (params.feed) {
      params.feed = new AtUri(params.feed).href
    }
    const { data, success } = await agent.value.app.bsky.feed.getFeed(params)
    if (success) {
      return {
        view: `feed-${params.feed}`,
        cursor: data.cursor,
        feed: data.feed
      }
    }
    return null
  }

  const getThreadTimeline = async (params: FeedParams) => {
    delete params.limit
    const { data, success } = await agent.value.getPostThread(params)
    if (success) {
      data.thread.replies.unshift({ post: data.thread.post })
      return {
        view: 'thread',
        cursor: undefined,
        feed: data.thread.replies
      }
    }
    return null
  }

  const postToggleLike = async (post: PostView) => {
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

  const postToggleRepost = async (post: PostView) => {
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

  const getFeedDetails = async (uri: string) => {
    feed.value = null
    agent.value = await skySessionStore.getAgent()
    uri = new AtUri(uri).href
    const { success, data } = await agent.value.app.bsky.feed.getFeedGenerator({ feed: uri })
    if (success) {
      feed.value = data.view
    }
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
    feed,
    isLoading,
    loadMore,
    viewTimeline,
    getFeedDetails,
    getTimelineByView,
    postToggleLike,
    postToggleRepost
  }
})
