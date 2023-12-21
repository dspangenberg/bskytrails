<script setup lang="ts">
export interface Props {
  title: string | null
}

defineProps<Props>()

</script>

<template>
  <div class="flex items-center flex-1 p-4">
    <h1 class="text-xl font-bold flex-1">
      {{ title }}
    </h1>
    <div class="flex-none">
      <storm-ui-icon-button
        icon="settings"
        tooltip="Homefeed-Einstellungen"
      />
    </div>
  </div>
</template>
