<script setup lang="ts">
interface ChatMessage {
  id: number
  content: string
  type: 'user' | 'system'
}

defineProps<{
  messages: ChatMessage[]
}>()
</script>

<template>
  <div class="overflow-y-auto p-4">
    <div v-for="msg in messages" :key="msg.id">
      <UserMessage v-if="msg.type === 'user'" :message="msg.content" />
      <SystemMessage v-else :message="msg.content" />
    </div>
  </div>
</template> 