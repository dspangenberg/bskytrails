<script setup lang="ts">
import { computed, toRef } from 'vue'
import { id as id2 } from 'random-html-id'
import { useField } from 'vee-validate'

export interface Props {
  name: string
  rules?: string
  label?: string
  id?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  label: '',
  rules: undefined,
  disabled: false
})

const name = toRef(props, 'name')
const rules = toRef(props, 'rules')
const label = toRef(props, 'label')

const xid = id2()
const htmlId = computed(() => `checkbox-${xid}`)

const { value, errorMessage, meta } = useField(name, rules, { label })
const hasError = computed(() => meta.touched && errorMessage.value !== undefined)

</script>
<template>
  <label
    :for="htmlId"
    class="relative inline-flex cursor-pointer items-center"
  >
    <input
      :id="htmlId"
      v-model="value"
      type="checkbox"
      class="peer sr-only"
    >
    <div class="h-6 w-11 rounded-full bg-gray-100 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all after:content-[''] hover:bg-gray-200 peer-checked:bg-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-200 peer-disabled:cursor-not-allowed peer-disabled:bg-gray-100 peer-disabled:after:bg-gray-50" />
    <span
      v-if="label"
      class="text-base pr-2 text-gray-500"
    >{{ label }}</span>
  </label>
</template>
