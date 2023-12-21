<script setup lang="ts">
import dayjs from 'dayjs'
import { ref, watch } from 'vue'
import { useTimestamp } from '@vueuse/core'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import 'dayjs/locale/de' // ES 2015
dayjs.extend(updateLocale)

dayjs.updateLocale('de', {
  relativeTime: {
    future: '',
    past: '%s',
    s: '< 1 Min',
    m: '1 Min',
    mm: '%d Min',
    h: '1 h',
    hh: '%d h',
    d: 'einen Tag',
    dd: '%d Tage',
    M: '1 Monat',
    MM: '%d Monate',
    y: '1 Jahr',
    yy: '%d Jahre'
  }
})

const { timestamp } = useTimestamp({ controls: true, interval: 1000 })

dayjs.locale('de')
dayjs.extend(relativeTime)

const value = ref('')
export type ToRelativeUnit = 'years' | 'quarters' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds';
export interface Props {
  date: string
  unit?: ToRelativeUnit | ToRelativeUnit[]
}

const props = withDefaults(defineProps<Props>(), {
  unit: () => ['days', 'hours', 'minutes', 'seconds']
})

watch(timestamp, () => {
  const relation = dayjs().to(props.date)
  value.value = relation
}, {
  immediate: true
})
</script>
<template>
  <div class="m-0 p-0">
    {{ value }}
  </div>
</template>
