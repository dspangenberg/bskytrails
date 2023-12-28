<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>
<template>
  <div class="min-h-full flex flex-1">
    <div class="flex-1 relative hidden w-0 lg:block">
      <img
        class="absolute inset-0 w-full h-full object-cover"
        src="@/assets/sky.jpeg"
        alt=""
      >
    </div>
    <div class="flex flex-1 flex-col justify-center px-4 py-12 lg:flex-none lg:px-20 sm:px-6 xl:px-24">
      <div class="w-full mx-auto max-w-sm lg:w-96">
        <div>
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
