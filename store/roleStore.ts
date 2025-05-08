import { create } from "zustand";
import { rolesApi } from "@/api/roles";
import { Role, PaginatedData } from "@/types";

interface RoleState {
  roles: Role[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    total: number;
    totalPages: number;
  };
  
  fetchRoles: (page?: number) => Promise<void>;
  getRoleById: (id: string) => Role | undefined;
  clearError: () => void;
}

export const useRoleStore = create<RoleState>((set, get) => ({
  roles: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    total: 0,
    totalPages: 0
  },
  
  fetchRoles: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await rolesApi.getRoles(page);
      
      if ( response.data) {
        const paginatedData = response.data ;
        set({ 
          roles: paginatedData,
          loading: false
        });
      } else {
        set({ 
          loading: false, 
          error:  "Failed to fetch roles" 
        });
      }
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || "Failed to fetch roles" 
      });
    }
  },
  
  getRoleById: (id) => {
    return get().roles.find(role => role.roleId === id);
  },
  
  clearError: () => set({ error: null })
}));