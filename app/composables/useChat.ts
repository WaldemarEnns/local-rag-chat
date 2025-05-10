import { ref } from 'vue'

export interface ChatMessage {
  id: number
  content: string
  type: 'user' | 'system'
}

export function useChat() {
  const chatHistory = ref<ChatMessage[]>([])
  let messageId = 0

  const sendMessage = async (message: string, model: string) => {
    // Add user message
    chatHistory.value.push({
      id: messageId++,
      content: message,
      type: 'user'
    })

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          model
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response from chat API')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response stream available')
      }

      let systemMessage = ''
      const systemMessageId = messageId++

      // Add initial system message
      chatHistory.value.push({
        id: systemMessageId,
        content: '',
        type: 'system'
      })

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Convert the chunk to text and parse the JSON response
        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('\n').filter(line => line.trim())
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            if (data.done) break
            
            if (data.message?.role === 'assistant' && data.message?.content) {
              systemMessage += data.message.content
              
              // Update the system message in the chat history
              const messageIndex = chatHistory.value.findIndex(msg => msg.id === systemMessageId)
              if (messageIndex !== -1) {
                chatHistory.value[messageIndex].content = systemMessage
              }
            }
          } catch (e) {
            console.error('Error parsing JSON:', e)
          }
        }
      }
    } catch (error) {
      console.error('Error in chat:', error)
      // Add error message to chat
      chatHistory.value.push({
        id: messageId++,
        content: 'Sorry, there was an error processing your message.',
        type: 'system'
      })
    }
  }

  const clearChat = () => {
    chatHistory.value = []
    messageId = 0
  }

  return {
    chatHistory,
    sendMessage,
    clearChat
  }
} 