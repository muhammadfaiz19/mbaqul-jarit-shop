import api from "@/lib/api";
import type { Category, ApiResponse } from "@/types";

export const categoryService = {
  getAll: async () => {
    return api.get<ApiResponse<Category[]>>("/categories");
  },

  getBySlug: async (slug: string) => {
    return api.get<ApiResponse<Category>>(`/categories/${slug}`);
  },

  create: async (formData: FormData) => {
    return api.post<ApiResponse<Category>>("/categories", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  update: async (slug: string, formData: FormData) => {
    return api.put<ApiResponse<Category>>(`/categories/${slug}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  delete: async (slug: string) => {
    return api.delete<ApiResponse<null>>(`/categories/${slug}`);
  },
};
