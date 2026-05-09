import axios from "axios";

const isServer = typeof window === "undefined";
const backendUrl = process.env.BACKEND_URL || "http://localhost:9090";

const api = axios.create({
  baseURL: isServer ? `${backendUrl}/api` : "/api",
  withCredentials: true, // Send cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor: unwrap data or handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Redirect to login if 401 is received (client-side only)
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default api;
