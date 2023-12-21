import { defineStore } from 'pinia'
import { ref } from 'vue'
import { BskyAgent, AppBskyFeedDefs, AppBskyGraphDefs, type AtpSessionEvent, type AppBskyFeedGetFeedGenerators, type AtpSessionData } from '@atproto/api'
type FeedPost = AppBskyFeedDefs.FeedViewPost

type FeedGenerators = AppBskyFeedGetFeedGenerators.Response
type ListView = AppBskyGraphDefs.ListView

type Agent = any
export interface Profile {
  avatar?: string
  banner?: string
  description?: string
  did?: string
  displayName: string
  followersCount?: number
  followsCount?: number
  handle?: string
  indexedAt?: string
  labels?: string[]
  postsCount?: number
  viewer: object
}

export const useSkySessionStore = defineStore('sky-session-store', () => {
  const agent = ref<Agent | null>(null)
  const profile = ref<Profile | null>(null)
  const actor = ref<Profile | null>(null)
  const pinnedFeeds = ref<FeedGenerators[] | null>(null)
  const lists = ref<ListView[] | null>(null)
  const timeline = ref<FeedPost[] | null>(null)
  const parentPost = ref<FeedPost | null>(null)
  const activeFeedName = ref<string | null>(null)

  const service = ref<string>('https://bsky.social')
  const store = useSkySessionStore()

  const isLoadingProfile = ref(false)
  const isTimeLineLoading = ref(false)
  const isLoadingFeeds = ref(false)
  const isLoadingLists = ref(false)

  const getCurrentDid = () => {
    const session = localStorage.getItem('skytrails_session')
    if (session) {
      const { did } = JSON.parse(session)
      return did
    }
  }

  const createAgent = (srv: string): void => {
    service.value = srv
    agent.value = new BskyAgent({
      service: srv,
      persistSession: (evt: AtpSessionEvent, sess?: AtpSessionData): void => {
        if (sess !== undefined) {
          localStorage.setItem('skytrails_session', JSON.stringify(sess))
        }
      }
    })
  }
  const getServiceFromCreditialsStore = () => {
    const credentials = localStorage.getItem('credentials')
    if (credentials) {
      const { service } = JSON.parse(credentials)
      return service
    }
  }

  const getAgent = async (service?: string) => {
    if (agent.value === null) {
      if (service === undefined) {
        service = getServiceFromCreditialsStore()
      }
      createAgent('https://bsky.social')
    }

    if (agent.value?.session?.did) {
      return agent.value
    }

    const session: string | null = localStorage.getItem('skytrails_session')
    if (agent.value && session !== null) {
      agent.value.resumeSession(JSON.parse(session))
      return agent.value
    }
  }

  const getActorProfile = async (did: string) => {
    isLoadingProfile.value = true
    if (!agent.value) {
      getAgent()
    }
    const { data, success } = await agent.value.getProfile({ actor: did })
    isLoadingProfile.value = false
    if (success) {
      actor.value = data
    }
  }

  const follow = async (did: string) => {
    const { data, success } = await agent.value.follow(did)
    console.log(data, success)
  }

  const getPosts = async (uris: string[]) => {
    isTimeLineLoading.value = true
    if (!agent.value) {
      getAgent()
    }

    const { data, success } = await agent.value.getPosts({ uris })

    if (success) {
      const posts: FeedPost[] = []
      for (const post of data.posts) { posts.push({ post }) }
      store.$patch((state) => {
        state.timeline = posts
      })
    }
    isTimeLineLoading.value = false
  }

  const getActorLists = async (actor: string) => {
    const { data, success } = await agent.value.app.bsky.graph.getLists({ actor })
    if (success) {
      lists.value = data.lists
    }
    isLoadingLists.value = false
  }

  const getMyProfile = async () => {
    if (agent.value?.session?.did) {
      isLoadingLists.value = true
      isLoadingFeeds.value = true
      isLoadingProfile.value = true

      const { data, success } = await agent.value.getProfile({ actor: agent.value.session?.did })
      if (success) {
        profile.value = data
      }

      await getActorLists(agent.value.session?.did)

      const result = await agent.value.getPreferences()
      const returns = await agent.value.app.bsky.feed.getFeedGenerators({ feeds: result.feeds.pinned })
      isLoadingFeeds.value = false

      pinnedFeeds.value = returns.data.feeds
      isLoadingProfile.value = false
    }
  }

  const isLoggedIn = ref(false)

  const login = async (service: string, identifier: string, password: string) => {
    if (!agent.value) {
      createAgent(service)
    }
    if (agent.value) {
      await agent.value.login({ identifier, password })
    }
  }

  return {
    isTimeLineLoading,
    activeFeedName,
    pinnedFeeds,
    isLoadingProfile,
    isLoadingFeeds,
    actor,
    parentPost,
    follow,
    getActorProfile,
    isLoggedIn,
    lists,
    isLoadingLists,
    getAgent,
    getPosts,
    getCurrentDid,
    getMyProfile,
    login,
    createAgent,
    profile,
    timeline
  }
})
