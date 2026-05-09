import api from "@/lib/api";
import type { GalleryItem, ApiResponse } from "@/types";

export const galleryService = {
  getAll: async () => {
    return api.get<ApiResponse<GalleryItem[]>>("/gallery");
  },

  create: async (formData: FormData) => {
    return api.post<ApiResponse<GalleryItem>>("/gallery", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  update: async (id: string, formData: FormData) => {
    return api.put<ApiResponse<GalleryItem>>(`/gallery/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  delete: async (id: string) => {
    return api.delete<ApiResponse<null>>(`/gallery/${id}`);
  },
};
