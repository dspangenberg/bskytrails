<script setup lang="ts">
import { computed } from 'vue'
export interface Props {
  embeded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  embeded: false
})

const firstColumnClass = computed(() => props.embeded ? 'w-10' : 'w-16')

</script>

<template>
  <div class="py-2 px-4">
    <div class="flex flex-1 items-center space-x-2">
      <div
        class="flex-none"
        :class="firstColumnClass"
      >
        <div class="w-12" />
      </div>
      <div class="flex-1">
        <slot name="header" />
      </div>
    </div>
    <div class="flex flex-1 items-center space-x-2 py-1">
      <div
        class="flex-none"
        :class="firstColumnClass"
      >
        <slot name="avatar" />
      </div>
      <div
        class="flex-1 flex flex-col"
      >
        <slot name="title" />
      </div>
      <div
        class="flex-none text-right text-sm text-gray-400"
        :class="firstColumnClass"
      >
        <slot name="title-right" />
      </div>
    </div>
    <div class="flex flex-1 items-center space-x-2 py-1">
      <div
        class="flex-none"
        :class="firstColumnClass"
      >
        <div class="w-12" />
      </div>
      <div class="flex-1">
        <slot name="content" />
      </div>
    </div>
    <div class="flex flex-1 items-center space-x-2">
      <div
        class="flex-none"
        :class="firstColumnClass"
      >
        <div class="w-12" />
      </div>
      <div class="flex-1">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
