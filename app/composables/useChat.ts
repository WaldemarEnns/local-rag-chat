import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

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

export function useChat() {
  const sessions = ref<ChatSession[]>([])
  const currentSessionId = ref<string | null>(null)
  let messageId = 0

  const createNewSession = () => {
    const session: ChatSession = {
      id: uuidv4(),
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    sessions.value.push(session)
    currentSessionId.value = session.id
    return session
  }

  const getCurrentSession = () => {
    if (!currentSessionId.value) {
      return createNewSession()
    }
    const session = sessions.value.find(s => s.id === currentSessionId.value)
    if (!session) {
      return createNewSession()
    }
    return session
  }

  const sendMessage = async (message: string, model: string) => {
    const session = getCurrentSession()
    
    // Add user message
    const userMessage: ChatMessage = {
      id: messageId++,
      content: message,
      role: 'user'
    }

    const history = session.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    session.messages.push(userMessage)
    session.updatedAt = new Date()

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          model,
          sessionId: session.id,
          history,
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response from chat API')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response stream available')
      }

      let assistantMessage = ''
      const assistantMessageId = messageId++

      // Add initial assistant message
      const assistantMessageObj: ChatMessage = {
        id: assistantMessageId,
        content: '',
        role: 'assistant'
      }

      session.messages.push(assistantMessageObj)

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
              assistantMessage += data.message.content
              
              // Update the assistant message in the chat history
              const messageIndex = session.messages.findIndex(msg => msg.id === assistantMessageId)
              if (messageIndex !== -1) {
                session.messages[messageIndex].content = assistantMessage
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
      session.messages.push({
        id: messageId++,
        content: 'Sorry, there was an error processing your message.',
        role: 'assistant'
      })
    }
  }

  const clearChat = () => {
    if (currentSessionId.value) {
      const session = sessions.value.find(s => s.id === currentSessionId.value)
      if (session) {
        session.messages = []
        session.updatedAt = new Date()
      }
    }
    messageId = 0
  }

  const switchSession = (sessionId: string) => {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      currentSessionId.value = sessionId
    }
  }

  return {
    sessions,
    currentSessionId,
    sendMessage,
    clearChat,
    switchSession,
    createNewSession
  }
} 