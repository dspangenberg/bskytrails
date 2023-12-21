<script setup lang="ts">
import { ref } from 'vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
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
    <h1 class="text-xl font-bold flex-1">
      Lesezeichen
    </h1>
    <div class="flex-none">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <storm-ui-icon-button
            icon="arrows-sort"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent class="min-w-64">
          <DropdownMenuLabel>Sortierung</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup v-model="field">
            <DropdownMenuRadioItem value="indexed">
              Veröffentlichung
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bookmarked">
              Lesezeichen
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            :checked="order==='desc'"
            @click="toggleOrder"
          >
            Neueste zuerst
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>
