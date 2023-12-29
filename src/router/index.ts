import { createRouter, createWebHistory } from 'vue-router'
import { useSkySessionStore } from '@/stores/SkySessionStore.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'authLayout',
      meta: { requiresAuth: false },
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/Login.vue')
        }
      ]
    },
    {
      path: '/',
      name: 'appLayout',
      meta: { requiresAuth: true },
      component: () => import('@/layouts/AppLayout.vue'),
      children: [
        {
          path: 'home',
          name: 'home',
          props: {
            view: 'timeline'
          },
          component: () => import('@/views/Home.vue')
        },
        {
          path: 'notifications',
          name: 'notifications',
          component: () => import('@/views/Notifications.vue')
        },
        {
          path: 'bookmarks',
          name: 'bookmarks',
          component: () => import('@/views/Home.vue')
        },
        {
          path: 'profile/:handle?',
          name: 'profile',
          component: () => import('@/views/Home.vue')
        },
        {
          path: 'feed',
          name: 'feeds',
          component: () => import('@/views/Home.vue'),
          children: [{
            path: ':uri/:type/:name',
            name: 'feeds-timeline',
            component: () => import('@/views/Home.vue')
          }
          ]
        },
        {
          path: 'lists',
          name: 'lists',
          component: () => import('@/views/Home.vue'),
          children: [{
            path: ':uri/:type/:name',
            name: 'lists-feed',
            component: () => import('@/views/Home.vue')
          }
          ]
        },
        {
          path: 'thread/:uri',
          name: 'thread',
          component: () => import('@/views/Home.vue')
        },
        {
          path: 'preferences',
          name: 'preferences',
          component: () => import('@/views/Preferences.vue')
        }
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth === false) {
    next()
  } else {
    try {
      const skySessionStore = useSkySessionStore()
      const agent = await skySessionStore.getAgent()

      if (agent?.hasSession) {
        next()
      } else {
        next({ name: 'login' })
      }
    } catch (error) {
      console.log(error)
      next({ name: 'login' })
    }
  }
})

export default router
