<script setup lang="ts">
import type { ChatMessage } from '~/composables/useChat'

defineProps<{
  messages: ChatMessage[]
}>()
</script>

<template>
  <div class="overflow-y-auto p-4">
    <div v-for="msg in messages" :key="msg.id">
      <UserMessage v-if="msg.role === 'user'" :message="msg.content" />
      <AssistantMessage v-else :message="msg.content" />
    </div>
  </div>
</template> 