<script setup lang="ts">
import {
  DropdownMenuItemIndicator,
  DropdownMenuRadioItem,
  type DropdownMenuRadioItemEmits,
  type DropdownMenuRadioItemProps,
  useEmitAsProps
} from 'radix-vue'
import { cn } from '@/util'

const props = defineProps<DropdownMenuRadioItemProps & { class?: string }>()

const emits = defineEmits<DropdownMenuRadioItemEmits>()
</script>

<template>
  <DropdownMenuRadioItem
    v-bind="{ ...props, ...useEmitAsProps(emits) }"
    :class="cn(
      'flex relative items-center hover:bg-stone-100 rounded-md transition-colors data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[highlighted]:bg-outline-hover pl-7 py-1.5 text-sm outline-none select-none cursor-default',
      props.class,
    )"
  >
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">

      <DropdownMenuItemIndicator>
        <storm-ui-icon
          name="tabler-point"
          class="w-4 h-4 text-black"
        />
      </DropdownMenuItemIndicator>
    </span>
    <slot />
  </DropdownMenuRadioItem>
</template>
