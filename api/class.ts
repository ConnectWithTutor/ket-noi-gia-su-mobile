import { 
 
  PaginatedResponse, 
  SingleItemResponse,
    Class,
    ClassCreateRequest,

} from "@/types";

import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
export const classApi = {
  // Get all student requests
  getClass: async (page = 1, limit = 10) => {
    
    return api.get<PaginatedResponse<Class>>(`${API_ENDPOINTS.classes}?page=${page}&limit=${limit}`);
  },
    getClassByStatus: async (status_id: string, page = 1, limit = 10) => {
        return api.get<PaginatedResponse<Class>>(
            `${API_ENDPOINTS.classesByStatus(status_id)}?page=${page}&limit=${limit}`
        );
    },

    getClassById: async (class_id: string) => {
        return api.get<SingleItemResponse<Class>>(API_ENDPOINTS.classesById(class_id));
    },
    findBestClasses: async (data?: { keyword?: string; userId?: string; limit?: number }) => {
        return api.post<PaginatedResponse<Class>>(API_ENDPOINTS.findBestClasses, data);
    },
    createClass: async (data: ClassCreateRequest) => {
        return api.post<SingleItemResponse<Class>>(API_ENDPOINTS.createClasses, data);
    },

    updateClass: async (class_id: string, data: Partial<ClassCreateRequest>) => {
        return api.put<SingleItemResponse<Class>>(API_ENDPOINTS.updateClasses(class_id), data);
    },

    deleteClass: async (class_id: string) => {
        return api.delete<SingleItemResponse<Class>>(API_ENDPOINTS.deleteClasses(class_id));
    }
};