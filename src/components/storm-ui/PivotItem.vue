<script setup lang="ts">
import { computed } from 'vue'
import { type RouteParams, type LocationQuery, useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  useScope: 'global'
})

const router = useRouter()
const route = useRoute()

export interface Props {
  active?: boolean
  activeRoutePath?: string
  badgeAnimate?: boolean
  badgeColor?: string
  badgeCount?: number
  badgeDot?: boolean
  disabled?: boolean
  hidden?: boolean
  icon?: string
  iconStrokeWidth?: number
  i18n?: boolean,
  info?: string
  label: string,
  loading?: boolean
  open?: boolean
  routeName?: string,
  routeParams?: RouteParams,
  routeQuery?: LocationQuery
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  activeRoutePath: '',
  badgeAnimate: false,
  badgeColor: 'red',
  badgeCount: 0,
  badgeDot: true,
  disabled: false,
  hidden: false,
  i18n: false,
  icon: '',
  iconStrokeWidth: 2,
  info: '',
  loading: false,
  routeName: '',
  routeParams: undefined,
  routeQuery: undefined
})

const href = computed(() => {
  try {
    const route = router.resolve({
      name: props.routeName,
      params: props.routeParams,
      query: props.routeQuery
    })
    return route
  } catch (error) {
    console.error(error)
    return ''
  }
})

const translatedLabel = computed(() => props.i18n ? t(props.label) : props.label)

const isActive = computed(() => {
  if (props.active) {
    return true
  }
  const currentRoute = route.path
  if (props.activeRoutePath) {
    return currentRoute.startsWith(props.activeRoutePath)
  }

  return currentRoute === href.value
})

const emit = defineEmits(['click'])

const onClick = () => {
  if (props.routeName) {
    router.push(route)
  }
  if (!props.disabled && !props.loading) {
    emit('click')
  }
}

</script>

<template>
  <li
    :class="
      [
        isActive ? ' border-blue-500 hover:border-blue-600 hover:text-blue-600 text-blue-500 font-bold' : 'border-transparent font-medium hover:border-gray-500 text-gray-500',
        disabled ? '!text-gray-300 cursor-not-allowed hover:border-transparent' : 'cursor-pointer',
      ]"
    class="border-b-2 pb-1 flex items-center"
    @click="onClick"
  >
    <slot>
      <div class="flex items-center">
        <div
          v-if="icon"
          class="flex-shrink-0"
        >
          <storm-ui-icon
            :name="icon"
            class="w-5 h-5 mr-0.5"
          />
        </div>
        <div>
          {{ translatedLabel }}
          <span
            v-if="badgeCount && badgeCount > 0"
            class="relative"
          >
            <span
              v-if="!disabled && badgeCount && badgeDot"
              class="absolute -top-1.5 left-0.5"
            >
              <storm-ui-status-dot
                :animate="badgeAnimate"
                :color="badgeColor"
                class="ml-auto text-right mr-4"
              />

            </span>
            <span v-else>
              {{ badgeCount }}
            </span>
          </span>
        </div>
      </div>
    </slot>
  </li>
</template>
