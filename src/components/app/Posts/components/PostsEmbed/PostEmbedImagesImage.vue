<script setup lang="ts">

export type Props = {
  image: string
}

const emit = defineEmits(['click'])

defineProps<Props>()

</script>

<template>
  <li>
    <img
      :src="image"
      class="object-cover border rounded-md max-h-[200px] mx-auto"
      alt=""
      @click="emit('click')"
    >
  </li>
</template>
