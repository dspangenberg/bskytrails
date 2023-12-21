<template>
  <div class="flex items-center w-full flex-1">
    <div class="flex-1">
      <div class="text-base w-full flex space-x-6 ">
        <slot />
      </div>
    </div>
    <div class="flex-none">
      <div class="text-base w-full flex space-x-6">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>
