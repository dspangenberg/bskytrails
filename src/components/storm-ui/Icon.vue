<script setup lang="ts">
import { defineAsyncComponent, shallowRef, toRefs, watch } from 'vue'

export interface Props {
  strokeWidth?: number
  fill?: boolean
  tooltip?: string
  name: string
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
  strokeWidth: 2,
  tooltip: ''
})

const iconPath = shallowRef()
const { name } = toRefs(props)

watch(name, async (icon) => {
  if (!icon) return
  iconPath.value = defineAsyncComponent(() =>
    import(`../../assets/icons/${icon.replace('tabler-', '')}.svg`)
  )
}, { immediate: true })

</script>

<template>
  <component
    :is="iconPath"
    viewBox="0 0 24 24"
    aria-hidden="true"
    :stroke-width="strokeWidth"
  />
</template>
