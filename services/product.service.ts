import api from "@/lib/api";
import type { Product, PaginatedResponse, ApiResponse } from "@/types";

export interface ProductQueryParams {
  search?: string;
  category?: string; // category slug
  categoryId?: number;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}

export const productService = {
  getAll: async (params?: ProductQueryParams) => {
    return api.get<PaginatedResponse<Product>>("/products", { params });
  },

  getFeatured: async () => {
    return api.get<ApiResponse<Product[]>>("/products/featured");
  },

  getBySlug: async (slug: string) => {
    return api.get<ApiResponse<Product>>(`/products/${slug}`);
  },

  create: async (formData: FormData) => {
    return api.post<ApiResponse<Product>>("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  update: async (slug: string, formData: FormData) => {
    return api.put<ApiResponse<Product>>(`/products/${slug}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  delete: async (slug: string) => {
    return api.delete<ApiResponse<null>>(`/products/${slug}`);
  },
};
