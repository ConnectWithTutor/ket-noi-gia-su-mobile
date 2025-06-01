import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL,PREFIX } from "@/constants/config";

class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL + PREFIX,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  withCredentials: true,
});

// Helper to get auth token from storage
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem("auth_token");
  } catch (error) {
    console.error("Failed to get auth token", error);
    return null;
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    // Only add token if not already provided in the request config
    if (!config.headers.Authorization) {
      const token = await getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      
      const status = error.response.status;
      console.error("API Error:", error.response.data);
      const data = error.response.data as any;
      const message = data?.message || data?.error || "An error occurred";
      
      return Promise.reject(new ApiError(message, status));
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new ApiError("No response from server", 0));
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(new ApiError(error.message || "Request failed", 0));
    }
  }
);

export const api = {
  async request<T>(endpoint: string, options: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response = await axiosInstance({
        url: endpoint,
        ...options
      });
      
      return response.data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 0;
        const message = 
          error.response?.data?.message || 
          error.response?.data?.error || 
          error.message || 
          "Network error";
        
        throw new ApiError(message, status);
      }
      
      throw new ApiError(
        (error as Error).message || "Unknown error",
        0
      );
    }
  },
  
  get<T>(endpoint: string, config: AxiosRequestConfig = {}) {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  },
  
  post<T>(endpoint: string, data: any, config: AxiosRequestConfig = {}) {
    return this.request<T>(endpoint, { ...config, method: "POST", data });
  },
  
  put<T>(endpoint: string, data: any, config: AxiosRequestConfig = {}) {
    return this.request<T>(endpoint, { ...config, method: "PUT", data });
  },
  
  patch<T>(endpoint: string, data: any, config: AxiosRequestConfig = {}) {
    return this.request<T>(endpoint, { ...config, method: "PATCH", data });
  },
  
  delete<T>(endpoint: string, config: AxiosRequestConfig = {}) {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  },
};
