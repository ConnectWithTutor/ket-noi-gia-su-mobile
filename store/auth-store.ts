import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState, UserRole } from '@/types/user';

interface AuthStore extends AuthState {
  login: (phone: string, password: string) => Promise<void>;
  register: (
    name: string,
    phone: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (phone, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Mock user data
          const user: User = {
            id: '1',
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
            phone,
            role: 'student',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
            subjects: ['Toán', 'Lý', 'Hóa'],
            createdAt: new Date().toISOString(),
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: "Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.", 
            isLoading: false 
          });
        }
      },

      register: async (name, phone, email, password, role) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Mock user data
          const user: User = {
            id: '1',
            name,
            email,
            phone,
            role,
            createdAt: new Date().toISOString(),
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: "Đăng ký thất bại. Vui lòng thử lại sau.", 
            isLoading: false 
          });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      changePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set({ isLoading: false });
          return Promise.resolve();
        } catch (error) {
          set({ 
            error: "Đổi mật khẩu thất bại. Vui lòng thử lại sau.", 
            isLoading: false 
          });
          return Promise.reject(error);
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);