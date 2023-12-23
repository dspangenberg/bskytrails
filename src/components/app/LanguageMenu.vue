<script setup lang="ts">
import { ref } from 'vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/shadn/ui/dropdown-menu'

export interface Props {
  title: string | null
}

const field = ref('indexed')
const order = ref('desc')

defineProps<Props>()

const toggleOrder = () => {
  order.value = order.value === 'desc' ? 'asc' : 'desc'
}

</script>

<template>
  <div class="flex items-center flex-1 p-4">
    <div class="flex-none">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <storm-ui-icon-button
            icon="language"
            variant="outline"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent class="min-w-64">
          <DropdownMenuRadioGroup v-model="field">
            <DropdownMenuRadioItem value="indexed">
              Deutsch
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bookmarked">
              English
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>
