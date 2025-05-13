import { api, getAuthToken } from "@/services/api";
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  User,
  PasswordResetRequest,
  PasswordChangeRequest
} from "@/types";

export const authApi = {

  login: (credentials: LoginRequest) => {
    
    return api.post<AuthResponse>("/auth/login", credentials);
  },
  
  register: (userData: RegisterRequest) => {
    return api.post<AuthResponse>("/auth/register", userData);
  },
  
  logout: async () => {
    const token = await getAuthToken();
    return api.post<null>("/auth/logout", {}, { headers: { Authorization: `Bearer ${token || ''}` } });
  },
  
  getCurrentUser: async () => {
    const token = await getAuthToken();
    if (!token) throw new Error("No authentication token found");
    return api.get<User>("/auth/me", { headers: { Authorization: `Bearer ${token}` } });
  },

  forgotPassword: (email: string) => {
    return api.post<{ message: string }>("/auth/forgot-password", { email });
  },

  resetPassword: (token: string, password: string) => {
    return api.post<{ message: string }>("/auth/reset-password", { 
      token, 
      password 
    });
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    const token = await getAuthToken();
    if (!token) throw new Error("No authentication token found");
    
    return api.post<{ message: string }>("/auth/change-password", {
      oldPassword,
      newPassword
    }, { headers: { Authorization: `Bearer ${token}` } });
  }
};