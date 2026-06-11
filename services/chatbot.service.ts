import api from "@/lib/api";
import type { ChatbotContext, ChatbotFile, ChatResponse, ApiResponse } from "@/types";

export const chatbotService = {
  // === Existing methods (jangan dihapus) ===
  chat: async (message: string) => {
    return api.post<ApiResponse<ChatResponse>>("/chatbot", { message });
  },

  getContexts: async () => {
    return api.get<ApiResponse<ChatbotContext[]>>("/chatbot/contexts");
  },

  updateContext: async (id: number, context: string) => {
    return api.put<ApiResponse<ChatbotContext>>(`/chatbot/contexts/${id}`, { context });
  },

  // === New methods untuk Context by Name ===
  getContextByName: async (name: string) => {
    return api.get<ApiResponse<ChatbotContext>>(`/chatbot/contexts/${name}`);
  },

  upsertContextByName: async (name: string, context: string) => {
    return api.put<ApiResponse<ChatbotContext>>(`/chatbot/contexts/${name}`, { context });
  },

  // === New methods untuk File Management ===
  getFiles: async () => {
    return api.get<ApiResponse<ChatbotFile[]>>("/chatbot/files");
  },

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<ApiResponse<ChatbotFile>>("/chatbot/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteFile: async (id: number) => {
    return api.delete<ApiResponse<null>>(`/chatbot/files/${id}`);
  },
};

