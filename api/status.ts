import { api } from "@/services/api";
import {  Status } from "@/types/status";
import {  PaginatedResponse } from "@/types";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const StatusApi = {
  
    // Get Status student-request
    getStatusStudentRequest: async (page = 1, limit = 20) => {
        return api.get<PaginatedResponse<Status>>(`${API_ENDPOINTS.studentRequestStatus}?page=${page}&limit=${limit}`);
    }, 
    getStatusTutorApplication: async (page = 1, limit = 20) => {
        return api.get<PaginatedResponse<Status>>(`${API_ENDPOINTS.tutorApplicationStatus}?page=${page}&limit=${limit}`);
    },
    // Get Status class 
    getStatusClass: async (page = 1, limit = 20) => {
        return api.get<PaginatedResponse<Status>>(`${API_ENDPOINTS.classesStatus}?page=${page}&limit=${limit}`);
    },
};  