import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "@/api/auth";
import { 
 
  LoginRequest, 
  RegisterRequest, 
  User 
} from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          
          const response = await authApi.login(credentials);
          if (response.access_token) {
            const token = response.access_token;
            await AsyncStorage.setItem("auth_token", token);
            // Fetch user data using the token
            const userResponse = await authApi.getCurrentUser();
            if ( userResponse) {
              set({
                user: userResponse,
                token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } else {
              set({
                isLoading: false,
                error: userResponse || "Failed to fetch user data",
              });
            }
          } else {
            set({
              isLoading: false,
              error: "Login failed",
            });
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Login failed",
          });
        }
      },
      
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register(userData);
          if (response) {
           
              set({
                 isLoading: false,
              });
           
          } else {
            set({
              isLoading: false,
              error: "Registration failed",
            });
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Registration failed",
          });
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        
        try {
          await authApi.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          await AsyncStorage.removeItem("auth_token");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },
      
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              ...userData,
            },
          });
        }
      },
      
      clearError: () => set({ error: null }),
      
      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const token = await AsyncStorage.getItem("auth_token");
          
          if (!token) {
            set({
              isAuthenticated: false,
              user: null,
              token: null,
              isLoading: false,
            });
            return false;
          }
          
          const response = await authApi.getCurrentUser();
          if ( response) {
            set({
              user: response,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            // Token is invalid or expired
            await AsyncStorage.removeItem("auth_token");
            set({
              isAuthenticated: false,
              user: null,
              token: null,
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          // Error occurred, clear auth state
          await AsyncStorage.removeItem("auth_token");
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            isLoading: false,
            error: null,
          });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);