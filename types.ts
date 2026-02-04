
export type MessageRole = 'user' | 'bot';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  imageUrl?: string;
  isGeneratingImage?: boolean;
}

export interface GeminiResponse {
  reply: string;
  birdName?: string;
  sillyDescription?: string;
  shouldGenerate: boolean;
  followUpQuestion?: string;
}