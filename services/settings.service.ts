import api from "@/lib/api";
import type { SiteSettings, ApiResponse } from "@/types";

export const settingsService = {
  get: async () => {
    return api.get<ApiResponse<SiteSettings>>("/settings");
  },

  update: async (data: Partial<SiteSettings>) => {
    return api.put<ApiResponse<SiteSettings>>("/settings", data);
  },
};
