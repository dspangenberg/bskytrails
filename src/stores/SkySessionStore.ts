import { defineStore } from 'pinia'
import { ref } from 'vue'
import { BskyAgent, AppBskyGraphDefs, AppBskyNotificationListNotifications, type AppBskyActorDefs, type AtpSessionEvent, type AppBskyFeedDefs, type AtpSessionData } from '@atproto/api'
type FeedPost = AppBskyFeedDefs.FeedViewPost

type FeedGenerator = AppBskyFeedDefs.GeneratorView
type ListView = AppBskyGraphDefs.ListView
type Notification = AppBskyNotificationListNotifications.Notification

type Agent = any
export type Profile = AppBskyActorDefs.ProfileViewDetailed

export type IKeyValueStore = {
  [key: string]: string | boolean | number
}

type NotificationView = {
  notifications: Notification[]
  cursor?: string
  seenAt?: string
}

export const useSkySessionStore = defineStore('sky-session-store', () => {
  const agent = ref<Agent | null>(null)
  const profile = ref<AppBskyActorDefs.ProfileViewDetailed | null>(null)
  const actor = ref<AppBskyActorDefs.ProfileViewDetailed | null>(null)
  const pinnedFeeds = ref<FeedGenerator[] | null>(null)
  const lists = ref<ListView[] | null>(null)
  const timeline = ref<FeedPost[] | null>(null)
  const notificationView = ref<NotificationView | null>(null)
  const parentPost = ref<FeedPost | null>(null)
  const activeFeedName = ref<string | null>(null)
  const unreadNotificationsCounter = ref<number>(0)

  const service = ref<string>('https://bsky.social')

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

  const getActorProfile = async (did: string, returnOnly = false) => {
    isLoadingProfile.value = true
    if (!agent.value) {
      getAgent()
    }
    const { data, success } = await agent.value.getProfile({ actor: did })
    isLoadingProfile.value = false
    if (success) {
      if (!returnOnly) {
        actor.value = data
      }
      return data
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
    const posts = []
    if (success) {
      for (const post of data.posts) {
        posts.push({ post })
      }
      return posts
    }
  }

  const getActorLists = async (actor: string) => {
    const { data, success } = await agent.value.app.bsky.graph.getLists({ actor })
    if (success) {
      lists.value = data.lists
    }
    isLoadingLists.value = false
  }

  const getFeedGeneratorDetails = async (feeds: FeedGenerator[]) => {
    const { success, data } = await agent.value.app.bsky.feed.getFeedGenerators({ feeds })
    if (success) {
      pinnedFeeds.value = data.feeds as FeedGenerator[]
    }
  }

  const getPreferences = async () => {
    const data = await agent.value.getPreferences()
    if (data.feeds?.pinned) {
      await getFeedGeneratorDetails(data.feeds.pinned)
      isLoadingFeeds.value = false
    }
  }

  const getNotifications = async () => {
    await getAgent()
    const params: IKeyValueStore = {}
    if (notificationView.value?.cursor) {
      // params.cursor = notificationView.value?.cursor
    }
    const { data, success } = await agent.value.listNotifications(params)
    if (success) {
      notificationView.value = {
        notifications: data.notifications,
        cursor: data.cursor,
        seenAt: data.seenAt
      }
    }
  }

  const getUnreadNotificationsCount = async () => {
    const { data, success } = await agent.value.countUnreadNotifications()
    if (success) {
      unreadNotificationsCounter.value = data.count
    }
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
      await getPreferences()
      await getUnreadNotificationsCount()
      await getNotifications()

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
    getNotifications,
    getUnreadNotificationsCount,
    notificationView,
    unreadNotificationsCounter,
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
