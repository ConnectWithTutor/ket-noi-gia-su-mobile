import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import {  SingleItemResponse, PaginatedResponse, User } from "@/types";

export const usersApi = {
  
    // Get users by ID
    getAllUsers: async (page = 1, limit = 20) => {
        return api.get<PaginatedResponse<User>>(`${API_ENDPOINTS.users}?page=${page}&limit=${limit}`); 
    },
    getUsersById: async (id: string) => {
    return api.get<User>(API_ENDPOINTS.userById(id));
    },
    //Update profile
    updateProfile: async (id: string, data: Partial<User>) => {
        return api.put<SingleItemResponse<User>>(API_ENDPOINTS.updateUser(id), data);
    },

};  