<script setup lang="ts">
import { computed } from 'vue'

export interface Props {
  src: string | undefined
  alt: string
  icon?: string
  iconColor?: string
  size?: number
  badgeColor?: string
  spinner?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 12,
  icon: undefined,
  iconColor: 'text-black',
  badgeColor: 'bg-white',
  spinner: false
})

const sizeClass = computed(() => {
  return {
    4: 'h-4 w-4',
    5: 'h-5 w-5',
    6: 'h-6 w-6',
    8: 'h-8 w-8',
    10: 'h-10 w-10',
    12: 'h-12 w-12'
  }[props.size]
})

</script>

<template>
  <div class=" border-stone-200 border rounded-full max-w-fit relative block">
    <img
      v-if="src"
      class=" rounded-full object-cover object-center border-2 border-white"
      :class="sizeClass"
      :src="src"
      :alt="alt"
    >
    <span
      v-else
      class="rounded-full block"
      :class="sizeClass"
    />
    <span
      v-if="spinner"
      class="absolute bottom-1 right-2 h-4 w-4 rounded-full"
    >

      <storm-ui-spinner
        :size="4"
      />

    </span>
    <span
      v-if="icon"
      class="absolute bottom-0 right-0 h-4 w-4 rounded-full ring ring-white"
      :class="[badgeColor]"
    >
      <storm-ui-icon
        :name="icon"
        class="h-4 w-4"
        :class="iconColor"
      />
    </span>
  </div>
</template>
