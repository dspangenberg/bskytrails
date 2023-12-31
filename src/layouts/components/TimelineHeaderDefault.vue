<script setup lang="ts">
export interface Props {
  title: string | null
}

defineProps<Props>()

</script>

<template>
  <div class="flex items-center flex-1 p-4">
    <h1 class="text-xl font-bold flex-1">
      {{ title || '&nbsp;' }}
    </h1>
  </div>
</template>
