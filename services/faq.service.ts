import api from "@/lib/api";
import type { Faq, ApiResponse } from "@/types";

export const faqService = {
  getAll: async () => {
    return api.get<ApiResponse<Faq[]>>("/faqs");
  },

  create: async (data: Omit<Faq, "id">) => {
    return api.post<ApiResponse<Faq>>("/faqs", data);
  },

  update: async (id: number, data: Partial<Faq>) => {
    return api.put<ApiResponse<Faq>>(`/faqs/${id}`, data);
  },

  delete: async (id: number) => {
    return api.delete<ApiResponse<null>>(`/faqs/${id}`);
  },
};
