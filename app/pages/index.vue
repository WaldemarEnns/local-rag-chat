<script setup lang="ts">
import { useModels } from '~/composables/useModels'
import { useChat } from '~/composables/useChat'

// Initialize models and chat
const { models, selectedModel, isLoading, error, fetchModels, setSelectedModel } = useModels()
const { chatHistory, sendMessage, clearChat } = useChat()

// Fetch models when the page is mounted
onMounted(() => {
  fetchModels()
})

const handleSendMessage = (message: string) => {
  sendMessage(message, selectedModel.value)
}

const handleModelChange = (modelId: string) => {
  setSelectedModel(modelId)
  clearChat()
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
            :models="models"
            :selected-model="selectedModel"
            :is-loading="isLoading"
            :error="error"
            @send="handleSendMessage"
            @update:selected-model="handleModelChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>