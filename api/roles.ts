import { api } from "@/services/api";
import { ApiResponse, PaginatedResponse, Role } from "@/types";

export const rolesApi = {
  // Get all roles
  getRoles: async (page = 1,limit =10) => {
    return api.get<PaginatedResponse<Role>>(`/roles?page=${page}&limit=${limit}`);
  },
  
  // Get role by ID
  // getRoleById: async (id: string) => {
  //   return api.get<ApiResponse<Role>>(`/roles/${id}`);
  // }
};  