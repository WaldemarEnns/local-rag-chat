import { ref } from 'vue'
import { useChatStorage } from './useChatStorage'
import { useChatCompletion } from './useChatCompletion'

export interface ChatMessage {
  id: number
  content: string
  role: 'user' | 'assistant'
}

export interface ChatSession {
  id: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

export const useChat = () => {
  const { 
    addUserMessage, 
    addAssistantMessage, 
    createNewSession, 
    getSessionMessages 
  } = useChatStorage()
  const { streamChatCompletion } = useChatCompletion()
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const streamingMessage = ref('')
  const selectedModel = ref<string>('')

  const sendMessage = async (message: string) => {
    if (!message.trim()) return
    if (!selectedModel.value) {
      error.value = 'No model selected'
      return
    }

    try {
      isLoading.value = true
      error.value = null
      streamingMessage.value = ''

      // Add user message to storage
      await addUserMessage(message)

      // Get current history for context
      const history = getSessionMessages()

      // Stream the response
      let fullResponse = ''
      await streamChatCompletion(
        message,
        history,
        selectedModel.value,
        (chunk: string) => {
          fullResponse += chunk
          streamingMessage.value = fullResponse // Update UI with current chunk
        },
        (error: Error) => {
          console.error('Stream error:', error)
        }
      )

      // After stream completes, add the full response to storage
      if (fullResponse) {
        await addAssistantMessage(fullResponse)
        streamingMessage.value = '' // Clear streaming message after storing
      }
    } catch (e) {
      error.value = 'Failed to send message'
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  return {
    sendMessage,
    createNewSession,
    getSessionMessages,
    isLoading,
    error,
    streamingMessage, // Expose streaming message for UI
    selectedModel,
  }
} 