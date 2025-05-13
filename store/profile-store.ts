import { create } from "zustand";
import { usersApi } from "@/api/user";
import { User, UserUpdateRequest } from "@/types";

interface UserProfileState {
    user: User | null;
    loading: boolean;
    error: string | null;
    fetchUserById: (id: string) => Promise<void>;
    updateUser: (id: string, data: UserUpdateRequest) => Promise<boolean>;
    clearError: () => void;
}

export const useUserProfileStore = create<UserProfileState>((set) => ({
    user: null,
    loading: false,
    error: null,

    fetchUserById: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await usersApi.getUsersById(id);
            if (response) {
                set({ user: response, loading: false });
                
            } else {
                set({
                    loading: false,
                    error:  "Không thể lấy thông tin người dùng",
                });

            }
        } catch (error: any) {
            set({
                loading: false,
                error: error.message || "Không thể lấy thông tin người dùng",
            });
        }
    },

    updateUser: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const response = await usersApi.updateProfile(id, data);
            if (response.data) {
                set({ user: response.data, loading: false });
                return true;
            } else {
                set({
                    loading: false,
                    error: response.detail?.msg || "Không thể cập nhật thông tin người dùng",
                });
                return false;
            }
        } catch (error: any) {
            set({
                loading: false,
                error: error.message || "Không thể cập nhật thông tin người dùng",
            });
            return false;
        }
    },

    clearError: () => set({ error: null }),
}));