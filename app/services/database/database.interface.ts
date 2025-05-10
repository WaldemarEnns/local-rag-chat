export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
  lastUpdated: number;
}

export interface ChatStorage {
  /**
   * Initialize the database
   */
  init(): Promise<void>;

  /**
   * Create a new chat session
   * @param sessionId Unique identifier for the session
   */
  createSession(sessionId: string): Promise<void>;

  /**
   * Get a chat session by ID
   * @param sessionId Session identifier
   */
  getSession(sessionId: string): Promise<ChatSession | null>;

  /**
   * Add a new message to an existing session
   * @param sessionId Session identifier
   * @param message Message to add
   */
  addMessage(sessionId: string, message: ChatMessage): Promise<void>;

  /**
   * Get all existing sessions
   */
  getAllSessions(): Promise<ChatSession[]>;

  /**
   * Delete a session
   * @param sessionId Session identifier
   */
  deleteSession(sessionId: string): Promise<void>;
} 