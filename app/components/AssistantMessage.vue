<script setup lang="ts">
defineProps<{
  content: string;
  isThinking?: boolean;
}>();
</script>

<template>
  <div class="flex flex-col space-y-2">
    <ChatThinking v-if="isThinking" />
    <div
      v-else
      class="prose prose-sm max-w-none"
      v-html="content"
    />
  </div>
</template> 