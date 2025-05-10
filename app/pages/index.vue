<script setup lang="ts">
import { useModels } from '~/composables/useModels'
import { useChat } from '~/composables/useChat'
import { computed, onMounted } from 'vue'

// Initialize models and chat
const { models, selectedModel, isLoading, error, fetchModels } = useModels()
const { sessions, currentSessionId, sendMessage, clearChat, createNewSession } = useChat()

// Fetch models when the page is mounted
onMounted(() => {
  fetchModels()
})

const handleSendMessage = (message: string) => {
  sendMessage(message, selectedModel.value)
}

const handleModelChange = (modelId: string) => {
  selectedModel.value = modelId
  clearChat()
  createNewSession()
}

const currentSession = computed(() => {
  return sessions.value.find(s => s.id === currentSessionId.value)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto py-8">
      <ChatInterface
        :models="models"
        :selected-model="selectedModel"
        :is-loading="isLoading"
        :error="error"
        @send="handleSendMessage"
        @update:selected-model="handleModelChange"
      />
      <ChatHistory
        v-if="currentSession"
        :messages="currentSession.messages"
      />
    </div>
  </div>
</template>