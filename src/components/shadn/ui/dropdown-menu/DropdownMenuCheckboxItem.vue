<script setup lang="ts">
import {
  DropdownMenuCheckboxItem,
  type DropdownMenuCheckboxItemEmits,
  type DropdownMenuCheckboxItemProps,
  DropdownMenuItemIndicator,
  useEmitAsProps
} from 'radix-vue'
import { cn } from '@/util'

const props = defineProps<DropdownMenuCheckboxItemProps & { class?: string }>()
const emits = defineEmits<DropdownMenuCheckboxItemEmits>()
</script>

<template>
  <DropdownMenuCheckboxItem
    v-bind="{ ...props, ...useEmitAsProps(emits) }"
    :class=" cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-7 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      props.class,
    )"
  >
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuItemIndicator class="w-5">

        <storm-ui-icon
          name="tabler-check"
          class="w-4 h-4 text-black"
        />
      </DropdownMenuItemIndicator>
    </span>
    <slot />
  </DropdownMenuCheckboxItem>
</template>
