<script setup lang="ts">
import { HoverCardRoot, type HoverCardRootProps, useForwardProps } from 'radix-vue'

const emit = defineEmits<{
  'updated':(value: boolean) => void
}>()

const props = defineProps<HoverCardRootProps>()
const forwarded = useForwardProps(props)
</script>

<template>
  <HoverCardRoot
    v-bind="forwarded"
    @update:open="emit('updated', open)"
  >
    <slot />
  </HoverCardRoot>
</template>
