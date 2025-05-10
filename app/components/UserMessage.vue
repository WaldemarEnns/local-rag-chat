<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div class="flex justify-end mb-4">
    <div class="bg-blue-500 text-white rounded-lg py-2 px-4 max-w-[80%]">
      {{ message }}
    </div>
  </div>
</template> 