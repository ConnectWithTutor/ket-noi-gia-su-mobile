import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import {
PaginatedResponse,
SingleItemResponse,
ClassRegistration,
ClassRegistrationCreateRequest,
} from "@/types";

import { api } from "@/services/api"
export const classRegistrationApi = {
getClassRegistrations: async (page = 1, limit = 10) => {
    return api.get<PaginatedResponse<ClassRegistration>>(
        `${API_ENDPOINTS.classRegistration}?page=${page}&limit=${limit}`
    );
},

getClassRegistrationsByClass: async (class_id: string, page = 1, limit = 10) => {
    return api.get<PaginatedResponse<ClassRegistration>>(
        `${API_ENDPOINTS.classRegistrationByClass(class_id)}?page=${page}&limit=${limit}`
    );
},

getClassRegistrationById: async (registration_id: string) => {
    return api.get<SingleItemResponse<ClassRegistration>>(
        API_ENDPOINTS.classRegistrationById(registration_id)
    );
},

getClassRegistrationsByStudent: async (student_id: string, page = 1, limit = 10) => {
    return api.get<PaginatedResponse<ClassRegistration>>(
        `${API_ENDPOINTS.classRegistrationByStudent(student_id)}?page=${page}&limit=${limit}`
    );
},

createClassRegistration: async (data: ClassRegistrationCreateRequest) => {
    return api.post<SingleItemResponse<ClassRegistration>>(
        API_ENDPOINTS.createClassRegistration,
        data
    );
},

updateClassRegistration: async (
    registration_id: string,
    data: Partial<ClassRegistrationCreateRequest>
) => {
    return api.put<SingleItemResponse<ClassRegistration>>(
        API_ENDPOINTS.classRegistrationById(registration_id),
        data
    );
},

deleteClassRegistration: async (registration_id: string) => {
    return api.delete<SingleItemResponse<ClassRegistration>>(
        API_ENDPOINTS.deleteClassRegistration(registration_id)
    );
},
};
