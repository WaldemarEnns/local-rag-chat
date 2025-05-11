<script setup lang="ts">
defineProps<{
  isThinking: boolean;
}>();
</script>

<template>
  <div
    v-if="isThinking"
    class="flex items-center space-x-2 text-gray-500 text-sm italic"
  >
    <div class="animate-pulse">Thinking about the user's request...</div>
  </div>
</template> 