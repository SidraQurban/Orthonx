import axios from "axios";
import storage from "../utils/storage";

// For Expo, use the environment variables or default to local IP
export const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.38:8000";
export const WS_URL = process.env.EXPO_PUBLIC_WS_URL || "ws://192.168.0.38:8000";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Global Errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle Unauthorized (e.g., clear store and redirect to login)
      await storage.deleteItem("authToken");
      await storage.deleteItem("userData");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
