import { ref } from 'vue';
import type { ChatMessage } from '~/services/database/database.interface';

export const useChatCompletion = () => {
  const isStreaming = ref(false);

  const streamChatCompletion = async (
    message: string,
    history: ChatMessage[],
    model: string,
    onChunk: (chunk: string) => void,
    onError: (error: Error) => void
  ) => {
    isStreaming.value = true;

    console.log('history: ', history)
    console.log('model: ', model)
    console.log('message: ', message)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: history.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          model
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chat API');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response stream available');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.done) break;
            
            if (data.message?.role === 'assistant' && data.message?.content) {
              onChunk(data.message.content);
            }
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
        }
      }
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Unknown error occurred'));
    } finally {
      isStreaming.value = false;
    }
  };

  return {
    streamChatCompletion,
    isStreaming,
  };
}; 