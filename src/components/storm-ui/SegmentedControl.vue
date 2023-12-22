<script setup lang="ts">
import { provide, toRefs, computed } from 'vue'
const emit = defineEmits(['update:modelValue', 'select'])

const setSegment = (name: string) => {
  console.log(name)
  emit('update:modelValue', name)
  emit('select', name)
}

export interface Props {
  modelValue?: string
  tag?: string
  containerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  tag: 'nav',
  containerClass: ''
})

const { modelValue } = toRefs(props)

const activeSegment = computed<string>(() => modelValue.value)

provide('selectedSegment', activeSegment.value)
provide('setSegment', setSegment)
provide('segmentProps', props)

</script>

<template>
  <component
    :is="tag"
    class="inline-flex p-1 bg-gray-200 dark:bg-gray-800 rounded-md space-x-1 text-base leading-tight mx-auto"
    :class="containerClass"
  >
    <slot />
  </component>
</template>
