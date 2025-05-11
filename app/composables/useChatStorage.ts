/**
 * This composable is responsible for storing the chat history in the browser's local storage.
 * It also handles the creation of new sessions and the loading of existing sessions.
 */

import { ref } from 'vue';
import type { ChatMessage, ChatSession } from '~/services/database/database.interface';
import { IndexedDBChatStorage } from '~/services/database/database.service';

export const useChatStorage = () => {
  const storage = new IndexedDBChatStorage();
  const isInitialized = ref(false);
  const currentSession = ref<ChatSession | null>(null);
  const currentSessionId = ref<string | null>(null);

  const initialize = async () => {
    if (!isInitialized.value) {
      await storage.init();
      isInitialized.value = true;
    }
  };

  const generateSessionId = () => {
    return crypto.randomUUID();
  };

  const createNewSession = async () => {
    await initialize();
    const newSessionId = generateSessionId();
    currentSessionId.value = newSessionId;
    currentSession.value = {
      sessionId: newSessionId,
      messages: [],
      lastUpdated: Date.now(),
    };
    return newSessionId;
  };

  const loadSession = async (sessionId: string) => {
    await initialize();
    currentSessionId.value = sessionId;
    currentSession.value = await storage.getSession(sessionId);
    return currentSession.value;
  };

  const addUserMessage = async (content: string) => {
    if (!currentSession.value) {
      throw new Error('No active session');
    }

    const message: ChatMessage = {
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    // If this is the first message, create the session in storage
    if (currentSession.value.messages.length === 0) {
      await storage.createSession(currentSession.value.sessionId);
    }

    await storage.addMessage(currentSession.value.sessionId, message);
    currentSession.value.messages.push(message);
    currentSession.value.lastUpdated = message.timestamp;
  };

  const addAssistantMessage = async (content: string) => {
    if (!currentSession.value) {
      throw new Error('No active session');
    }

    const message: ChatMessage = {
      role: 'assistant',
      content,
      timestamp: Date.now(),
    };

    await storage.addMessage(currentSession.value.sessionId, message);
    currentSession.value.messages.push(message);
    currentSession.value.lastUpdated = message.timestamp;
  };

  const getSessionMessages = () => {
    return currentSession.value?.messages || [];
  };

  return {
    createNewSession,
    loadSession,
    addUserMessage,
    addAssistantMessage,
    getSessionMessages,
    currentSession,
    currentSessionId,
  };
}; 