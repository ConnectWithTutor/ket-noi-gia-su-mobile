import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { 
 
  PaginatedResponse, 
  StudentRequest, 
  SingleItemResponse,
  StudentRequestCreateRequest, 
  StudentRequestUpdateRequest 
} from "@/types";

export const studentRequestsApi = {
  // Get all student requests
  getStudentRequests: async (page = 1, limit = 10) => {
    
    return api.get<PaginatedResponse<StudentRequest>>(`${API_ENDPOINTS.studentRequest}?page=${page}&limit=${limit}`);
  },
  
  // Get student requests by location
  getStudentRequestsByLocation: async (location: string, page = 1, limit = 10) => {
    return api.get<PaginatedResponse<StudentRequest>>(
      `${API_ENDPOINTS.studentRequestByLocation(location)}?page=${page}&limit=${limit}`
    );
  },
  
  // Get student requests by user
  getMyStudentRequests: async (id:string,page = 1, limit = 10) => {
    return api.get<PaginatedResponse<StudentRequest>>(`/student-request/get-by-user/${id}?page=${page}&limit=${limit}`);
  },
  
  // Get student request by ID
  getStudentRequestById: async (id: string) => {
    return api.get<SingleItemResponse<StudentRequest>>(API_ENDPOINTS.studentRequestById(id));
  },
  
  // Create a student request
  createStudentRequest: async (data: StudentRequestCreateRequest) => {
    return api.post<PaginatedResponse<StudentRequest>>(API_ENDPOINTS.createStudentRequest, data);
  },
  
  // Update a student request
  updateStudentRequest: async (id: string, data: StudentRequestUpdateRequest) => {
    return api.put<PaginatedResponse<StudentRequest>>(API_ENDPOINTS.updateStudentRequest(id), data);
  },
  
  // Delete a student request
  deleteStudentRequest: async (id: string) => {
    return api.delete<PaginatedResponse<null>>(API_ENDPOINTS.deleteStudentRequest(id));
  }
};