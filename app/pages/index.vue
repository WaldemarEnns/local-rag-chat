<script setup lang="ts">
interface ChatMessage {
  id: number
  content: string
  type: 'user' | 'system'
}

const chatHistory = ref<ChatMessage[]>([])
const selectedModel = ref('gpt-4')
let messageId = 0

const mockResponses = [
  "I understand your question. Let me help you with that.",
  "That's an interesting point. Here's what I think about it.",
  "I can provide more information on that topic.",
  "Let me break this down for you.",
  "Here's a detailed explanation of what you're asking."
]

const handleSendMessage = (message: string) => {
  // Add user message
  chatHistory.value.push({
    id: messageId++,
    content: message,
    type: 'user'
  })

  // Add mock system response
  setTimeout(() => {
    chatHistory.value.push({
      id: messageId++,
      content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
      type: 'system'
    })
  }, 500)
}

const handleModelChange = (modelId: string) => {
  selectedModel.value = modelId
  // TODO: Handle model change, e.g., clear chat history or show a message
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <div class="container mx-auto p-4 flex-1 flex flex-col">
      <div class="flex-1 flex flex-col">
        <div class="flex-1 overflow-y-auto">
          <ChatHistory :messages="chatHistory" />
        </div>
        <div class="sticky bottom-0 bg-white pt-4">
          <ChatInterface 
            @send="handleSendMessage"
            @model-change="handleModelChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>