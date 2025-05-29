import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { 
  PaginatedResponse, 
  Subject,
  SubjectCreateRequest,
  SubjectUpdateRequest,
  SingleItemResponse
} from "@/types";

export const subjectsApi = {
  // Get all subjects
  getSubjects: async (page = 1, limit = 20) => {
    return api.get<PaginatedResponse<Subject>>(`${API_ENDPOINTS.subjects}?page=${page}&limit=${limit}`);
  },
  
  // Get subject by ID
  getSubjectById: async (id: string) => {
    return api.get<SingleItemResponse<Subject>>(`${API_ENDPOINTS.subjects}/${id}`);
  },
  
  // Create subject (admin only)
  createSubject: async (data: SubjectCreateRequest) => {
    return api.post<PaginatedResponse<Subject>>(API_ENDPOINTS.createSubject, data);
  },
  
  // Update subject (admin only)
  updateSubject: async (id: string, data: SubjectUpdateRequest) => {
    return api.patch<PaginatedResponse<Subject>>(API_ENDPOINTS.updateSubject(id), data);
  },
  
  // Delete subject (admin only)
  deleteSubject: async (id: string) => {
    return api.delete<PaginatedResponse<null>>(API_ENDPOINTS.deleteSubject(id));
  }
};