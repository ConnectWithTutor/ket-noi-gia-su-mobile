import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { 
  PaginatedResponse, 
  
    Student,
} from "@/types";

export const studentApi = {
    // Get all subjects
    getStudents: async (page = 1, limit = 20) => {
        return api.get<PaginatedResponse<Student>>(`${API_ENDPOINTS.studentProfileById}?page=${page}&limit=${limit}`);
    },
    studentProfileById: async (user_id: string) => {
        return api.get<Student>(`${API_ENDPOINTS.studentProfileById(user_id)}`);
    },
    updateStudentProfiles: async (user_id: string, data: Partial<Student>) => {
        return api.put<Student>(`${API_ENDPOINTS.updateStudentProfiles(user_id)}`, data);
    },
  
}