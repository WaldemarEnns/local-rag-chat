import type { ChatMessage, ChatSession, ChatStorage } from './database.interface';

export class IndexedDBChatStorage implements ChatStorage {
  private readonly DB_NAME = 'chat_storage';
  private readonly STORE_NAME = 'sessions';
  private readonly DB_VERSION = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'sessionId' });
        }
      };
    });
  }

  private getStore(mode: IDBTransactionMode = 'readonly'): IDBObjectStore {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    const transaction = this.db.transaction(this.STORE_NAME, mode);
    return transaction.objectStore(this.STORE_NAME);
  }

  async createSession(sessionId: string): Promise<void> {
    const session: ChatSession = {
      sessionId,
      messages: [],
      lastUpdated: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const request = this.getStore('readwrite').put(session);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to create session'));
    });
  }

  async getSession(sessionId: string): Promise<ChatSession | null> {
    return new Promise((resolve, reject) => {
      const request = this.getStore().get(sessionId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(new Error('Failed to get session'));
    });
  }

  async addMessage(sessionId: string, message: ChatMessage): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.messages.push(message);
    session.lastUpdated = Date.now();

    return new Promise((resolve, reject) => {
      const request = this.getStore('readwrite').put(session);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to add message'));
    });
  }

  async getAllSessions(): Promise<ChatSession[]> {
    return new Promise((resolve, reject) => {
      const request = this.getStore().getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to get all sessions'));
    });
  }

  async deleteSession(sessionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = this.getStore('readwrite').delete(sessionId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete session'));
    });
  }
} 