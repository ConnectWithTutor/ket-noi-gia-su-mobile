import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { ApiResponse, PaginatedResponse } from "@/types";
import {StudentRequest, StudentRequestCreateRequest, StudentRequestUpdateRequest } from "@/types/student-request";
export const studentRequestsApi = {
  // Get all student requests
  getStudentRequests: async (page = 1, limit = 10) => {
    return api.get<PaginatedResponse<StudentRequest>>(`${API_ENDPOINTS.studentRequest}?page=${page}&limit=${limit}`);
  },
  
  // // Get student requests by location
  // getStudentRequestsByLocation: async (location: string, page = 1, limit = 10) => {
  //   return api.get<PaginatedResponse>(
  //     `${API_ENDPOINTS.studentRequestByLocation(location)}?page=${page}&limit=${limit}`
  //   );
  // },
  
  // // Get student requests by user
  // getStudentRequestsByUser: async (userId: string, page = 1, limit = 10) => {
  //   return api.get<PaginatedResponse>(
  //     `${API_ENDPOINTS.studentRequestByUser(userId)}?page=${page}&limit=${limit}`
  //   );
  // },
  
  // Create a student request
  createStudentRequest: async (data: StudentRequestCreateRequest) => {
    return api.post<ApiResponse<StudentRequest>>(API_ENDPOINTS.createStudentRequest, data);
  },
  
  // Update a student request
  updateStudentRequest: async (id: string, data: StudentRequestUpdateRequest) => {
    return api.patch<ApiResponse<StudentRequest>>(API_ENDPOINTS.updateStudentRequest(id), data);
  },
  
  // Delete a student request
  deleteStudentRequest: async (id: string) => {
    return api.delete<ApiResponse<null>>(API_ENDPOINTS.deleteStudentRequest(id));
  }
};