<script setup lang="ts">
import { computed } from 'vue'
import { useTemplateFilter } from '@/composables/useTemplateFilter.ts'

const { formatInt } = useTemplateFilter()
export interface Props {
  iconDefault: string
  iconActive: string
  iconSize?: string
  color?: string
  counter?: number
  active?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'text-sky-700',
  variant: 'error',
  counter: undefined,
  active: false,
  iconSize: 'lg'
})

const sizeClass = computed(() => {
  return {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }[props.iconSize]
})

</script>

<template>
  <div class="flex items-center">
    <storm-ui-icon
      :name="active ? iconActive : iconDefault"
      class="cursor-pointer"
      :class="[sizeClass, active ? color : `text-sky-700 hover:${color}`]"
    />
    <div
      v-if="counter !== undefined"
      class="pl-1.5 text-sm"
    >
      {{ formatInt(counter) }}
    </div>
  </div>
</template>
