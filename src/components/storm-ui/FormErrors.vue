<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface ErrorMessages {
  [field: string]: string
}

const { t } = useI18n({
  useScope: 'global'
})

export interface Props {
  messages: ErrorMessages
  group: string
}

const props = defineProps<Props>()

const errorMessages = computed(() => {
  const errors: string[] = []

  const keys = Object.keys(props.messages)

  if (keys.length) {
    for (const field of keys) {
      const fieldLabel = t(`${props.group}.${field}`)
      const error = props.messages[field].replace('$field', fieldLabel)
      errors.push(error)
    }
  }
  return errors
})

</script>

<template>
  <storm-ui-alert
    v-show="errorMessages.length"
    title="Fehler"
  >
    <ul class="list-inside list-disc">
      <li
        v-for="(message, index) in errorMessages"
        :key="index"
      >
        {{ message }}
      </li>
    </ul>
  </storm-ui-alert>
</template>
