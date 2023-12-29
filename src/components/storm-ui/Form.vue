<script setup lang="ts">
import { useForm } from 'vee-validate'
import { ref, watch } from 'vue'

export interface Props {
  initialValues: object;
}

const form = ref<HTMLFormElement | null>(null)
const props = defineProps<Props>()
const emit = defineEmits(['success', 'changed'])

const { setValues, handleSubmit, values, meta } = useForm({
  validateOnMount: false,
  initialValues: props.initialValues
})

watch(values, async (values) => {
  if (meta.value.dirty) {
    emit('changed', values)
  }
})

const onSubmit = handleSubmit(values => {
  emit('success', values)
})

defineExpose({ setValues, form })

</script>

<template>
  <form
    ref="form"
    @submit="onSubmit"
  >
    <slot />
  </form>
</template>
