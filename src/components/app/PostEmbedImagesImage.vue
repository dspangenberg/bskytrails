<script setup lang="ts">

export type Props = {
  image: string
}

defineProps<Props>()

</script>

<template>
  <div>
    <img
      :src="image"
      class="object-cover border rounded-md shadow-sm"
      alt=""
    >
  </div>
</template>
