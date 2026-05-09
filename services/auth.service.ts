import api from "@/lib/api";
import type { LoginPayload, LoginResponse, Admin, ApiResponse } from "@/types";

export const authService = {
  login: async (payload: LoginPayload) => {
    const response = await api.post<ApiResponse<LoginResponse>>("/auth", payload);
    return response.data;
  },

  me: async () => {
    const response = await api.get<ApiResponse<{ admin: Admin }>>("/auth/me");
    return response.data;
  },

  logout: async () => {
    const response = await api.post<ApiResponse<null>>("/auth/logout");
    return response.data;
  },
};
