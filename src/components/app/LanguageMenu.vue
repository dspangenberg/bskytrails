<script setup lang="ts">
import { ref } from 'vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/shadn/ui/dropdown-menu'

const lang = ref('de')

</script>

<template>
  <div class="flex items-end flex-1">
    <div class="flex-none">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <storm-ui-icon-button
            icon="language"
            variant="outline"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent class="min-w-64">
          <DropdownMenuRadioGroup v-model="lang">
            <DropdownMenuRadioItem value="de">
              Deutsch
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="en">
              English
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>
