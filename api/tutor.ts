import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { 
    PaginatedResponse, 
    Tutor,
    TutorProfile,
    TutorUpdateRequest,
    UpdateResponse
} from "@/types";

export const tutorApi = {
    // Get all subjects
    getTutors: async (page = 1, limit = 20) => {
        return api.get<PaginatedResponse<Tutor>>(`${API_ENDPOINTS.tutorProfile}?page=${page}&limit=${limit}`);
    },
    tutorProfileById: async (user_id: string) => {
        return api.get<TutorProfile>(`${API_ENDPOINTS.tutorProfileById(user_id)}`);
    },
    updateTutorProfiles: async (user_id: string, data: Partial<TutorUpdateRequest>) => {
        return api.put<UpdateResponse>(`${API_ENDPOINTS.updateTutorProfiles(user_id)}`, data);
    },

}