<script setup lang="ts">
import { useModels } from '~/composables/useModels'
import { useChat } from '~/composables/useChat'
import { computed, onMounted } from 'vue'

// Initialize models and chat
const { models, selectedModel: modelsSelectedModel, isLoading: isModelsLoading, error: modelsError, fetchModels } = useModels()
const { 
  sendMessage, 
  createNewSession, 
  getSessionMessages, 
  isLoading: isChatLoading, 
  error: chatError,
  streamingMessage,
  selectedModel: chatSelectedModel
} = useChat()

// Sync model selection between composables
const selectedModel = computed({
  get: () => modelsSelectedModel.value,
  set: (value) => {
    modelsSelectedModel.value = value;
    chatSelectedModel.value = value;
  }
});

// Initialize chat session when the page is mounted
onMounted(async () => {
  await fetchModels()
  await createNewSession()
})

const handleSendMessage = (message: string) => {
  sendMessage(message)
}

const handleModelChange = (modelId: string) => {
  selectedModel.value = modelId
  // Create a new session when model changes
  createNewSession()
}

// Get messages for display, including the streaming message if present
const displayMessages = computed(() => {
  const messages = getSessionMessages()
  if (streamingMessage.value) {
    return [...messages, { role: 'assistant', content: streamingMessage.value, timestamp: Date.now() }]
  }
  return messages
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto py-8">
      <ChatInterface
        :models="models"
        :selected-model="selectedModel"
        :is-loading="isModelsLoading || isChatLoading"
        :error="modelsError || chatError"
        @send="handleSendMessage"
        @update:selected-model="handleModelChange"
      />
      <ChatHistory
        :messages="displayMessages"
      />
    </div>
  </div>
</template>