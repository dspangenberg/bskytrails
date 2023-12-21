import '@/assets/main.css'
import '@fontsource/clear-sans/100.css'
import '@fontsource/clear-sans/300.css'
import '@fontsource/clear-sans/400.css'
import '@fontsource/clear-sans/500.css'
import '@fontsource/clear-sans/700.css'
import 'floating-vue/dist/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import FloatingVue from 'floating-vue'

import messages from '@intlify/unplugin-vue-i18n/messages'
import { localize, setLocale } from '@vee-validate/i18n'
import { configure, defineRule } from 'vee-validate'

import en from '@vee-validate/i18n/dist/locale/en.json'
import de from '@vee-validate/i18n/dist/locale/de.json'

import App from './App.vue'
import router from './router'
import { required, email, min } from '@vee-validate/rules'

const i18n = createI18n({
  legacy: false,
  locale: 'de',
  messages
})

defineRule('required', required)
defineRule('email', email)
defineRule('min', min)

configure({
  generateMessage: localize({
    en,
    de
  })
})

setLocale('de')

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(FloatingVue)
app.mount('#app')
