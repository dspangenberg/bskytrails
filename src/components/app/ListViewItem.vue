<script setup lang="ts">

export interface Props {
  embeded?: boolean
}

withDefaults(defineProps<Props>(), {
  embeded: false
})

</script>

<template>
  <div class="py-2 px-4">
    <div class="flex flex-1 items-center space-x-2">
      <div class="flex-none w-20">
        <div class="w-12" />
      </div>
      <div class="flex-1">
        <slot name="header" />
      </div>
      <div class="flex-none w-16" />
    </div>
    <div class="flex flex-1 items-center space-x-2 py-1">
      <div class="flex-none w-20">
        <slot name="avatar" />
      </div>
      <div
        class="flex-1 flex flex-col"
      >
        <slot name="title" />
      </div>
      <div class="flex-none w-16 text-right text-sm text-gray-400">
        <slot name="title-right" />
      </div>
    </div>
    <div class="flex flex-1 items-center space-x-2 py-1">
      <div class="flex-none w-20">
        <div class="w-12" />
      </div>
      <div class="flex-1">
        <slot name="content" />
      </div>
    </div>
    <div class="flex flex-1 items-center space-x-2">
      <div class="flex-none w-20">
        <div class="w-12" />
      </div>
      <div class="flex-1">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
