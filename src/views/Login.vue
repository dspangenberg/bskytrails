<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSkySessionStore } from '@/stores/SkySessionStore.ts'
import { useRouter } from 'vue-router'

const router = useRouter()
const skySessionStore = useSkySessionStore()

const { t } = useI18n({
  useScope: 'global'
})

const formRef = ref()

const form = reactive({
  identifier: '',
  password: '',
  service: ''
})

const onSubmit = async (values) => {
  localStorage.setItem('credentials', JSON.stringify({
    service: values.service,
    identifier: values.identifier
  }))
  await skySessionStore.login(values.service, values.identifier, values.password)
  router.push('/')
}

onMounted(() => {
  const credentials = localStorage.getItem('credentials')
  const appPassword = import.meta.env.VITE_APP_BSKY_APP_PASSWORD
  const service = import.meta.env.VITE_APP_BSKY_APP_SERVICE

  if (service) {
    form.service = service
  }

  if (appPassword) {
    form.password = appPassword
  }

  console.log(form)

  if (credentials) {
    const { service, identifier } = JSON.parse(credentials)
    form.service = service
    form.identifier = identifier
  }
  formRef.value.setValues(form)
})

</script>

<template>
  <div>
    <div>
      <h2 class="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-6">
        {{ t('auth.app') }}
        <div class="text-base pt-0.5 text-gray-400 font-normal">
          Version
        </div>
      </h2>
    </div>
    <storm-ui-form
      ref="formRef"
      class="space-y-3"
      :initial-values="form"
      @success="onSubmit"
    >
      <div>
        <storm-ui-input
          autofocus
          name="service"
          required
          rules="required"
          :label="t('forms.auth.fields.service')"
          :placeholder="t('forms.auth.fields.service')"
        >
          <template #prefix>
            <storm-ui-icon name="cloud" />
          </template>
        </storm-ui-input>
      </div>

      <div>
        <storm-ui-input
          name="identifier"
          rules="required"
          required
          :label="t('forms.auth.fields.identifier')"
          :placeholder="t('forms.auth.fields.identifier')"
        >
          <template #prefix>
            <storm-ui-icon name="mail" />
          </template>
        </storm-ui-input>
      </div>

      <div>
        <storm-ui-input
          name="password"
          required
          type="password"
          rules="required"
          :label="t('forms.auth.fields.password')"
          :placeholder="t('forms.auth.fields.password')"
        >
          <template #prefix>
            <storm-ui-icon
              name="key"
              class="mr-5 text-gray-500"
            />
          </template>
        </storm-ui-input>
      </div>

      <div>
        <storm-ui-button
          type="submit"
          variant="primary"
          full
          :label="t('forms.auth.buttons.login')"
        />
      </div>
    </storm-ui-form>
  </div>
</template>
