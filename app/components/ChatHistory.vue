<script setup lang="ts">
import type { ChatMessage } from '~/composables/useChat'

defineProps<{
  messages: ChatMessage[]
  isThinking?: boolean
}>()
</script>

<template>
  <div class="space-y-4 mt-4">
    <div
      v-for="message in messages"
      :key="message.timestamp"
      class="flex"
      :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
    >
      <UserMessage
        v-if="message.role === 'user'"
        :message="message.content"
      />
      <AssistantMessage
        v-else
        :content="message.content"
        :is-thinking="isThinking && message === messages[messages.length - 1]"
      />
    </div>
  </div>
</template> 