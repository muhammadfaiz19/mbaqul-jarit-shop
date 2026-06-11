export interface ChatbotContext {
  id: number;
  name: string;
  context: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessage {
  message: string;
}

export interface ChatResponse {
  answer: string;
  reasoning: string;
}

export interface ChatbotFile {
  id: number;
  filename: string;
  filePath: string;
  fileUrl: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

