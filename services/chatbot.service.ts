import api from "@/lib/api";
import type { ChatbotContext, ChatResponse, ApiResponse } from "@/types";

export const chatbotService = {
  chat: async (message: string) => {
    return api.post<ApiResponse<ChatResponse>>("/chatbot", { message });
  },

  getContexts: async () => {
    return api.get<ApiResponse<ChatbotContext[]>>("/chatbot/contexts");
  },

  updateContext: async (id: number, context: string) => {
    return api.put<ApiResponse<ChatbotContext>>(`/chatbot/contexts/${id}`, { context });
  },
};
