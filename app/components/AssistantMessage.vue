<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div class="flex justify-start mb-4">
    <div class="bg-gray-100 text-gray-800 rounded-lg py-2 px-4 max-w-[80%]">
      {{ message }}
    </div>
  </div>
</template> 