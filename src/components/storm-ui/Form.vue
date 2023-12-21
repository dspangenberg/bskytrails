<script setup lang="ts">
import { useForm } from 'vee-validate'

export interface Props {
  initialValues: object;
}

const props = defineProps<Props>()
const emit = defineEmits(['success'])

const { setValues, handleSubmit } = useForm({
  validateOnMount: false,
  initialValues: props.initialValues,
  initialErrors: {}
})

const onSubmit = handleSubmit(values => {
  console.log(values)
  emit('success', values)
})

defineExpose({ setValues })
</script>

<template>
  <form @submit="onSubmit">
    <slot />
  </form>
</template>
