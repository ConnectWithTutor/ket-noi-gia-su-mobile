import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { SingleItemResponse,PaginatedResponse, TutorApplication, TutorApplicationCreateRequest } from "@/types";

export const tutorApplicationsApi = {
  // Get all tutor applications
  getTutorApplications: async (page = 1, limit = 10) => {
    return api.get<PaginatedResponse<TutorApplication>>(
      `${API_ENDPOINTS.tutorApplication}?page=${page}&limit=${limit}`
    );
  },
  
  // Get tutor applications by user
  getTutorApplicationsByUser: async (userId: string, page = 1, limit = 10) => {
    return api.get<PaginatedResponse<TutorApplication>>(
      `${API_ENDPOINTS.tutorApplicationByUser(userId)}?page=${page}&limit=${limit}`
    );
  },
  
  // Get tutor applications by status
  getTutorApplicationsByStatus: async (statusId: string, page = 1, limit = 10) => {
    return api.get<PaginatedResponse<TutorApplication>>(
      `${API_ENDPOINTS.tutorApplicationByStatus(statusId)}?page=${page}&limit=${limit}`
    );
  },
  
  // Get tutor applications by request
  getTutorApplicationsByRequest: async (requestId: string, page = 1, limit = 10) => {
    return api.get<PaginatedResponse<TutorApplication>>(
      `${API_ENDPOINTS.tutorApplication}/get-by-request-id/${requestId}?page=${page}&limit=${limit}`
    );
  },
  
  // Get a single tutor application
  getTutorApplication: async (applicationId: string) => {
    return api.get<SingleItemResponse<TutorApplication>>(
      `${API_ENDPOINTS.tutorApplication}/${applicationId}`
    );
  },
  
  // Create a tutor application
  createTutorApplication: async (data: TutorApplicationCreateRequest) => {
    return api.post<TutorApplicationCreateRequest>(
      API_ENDPOINTS.createTutorApplication, 
      data
    );
  },
  
  // Update a tutor application
  updateTutorApplication: async (id: string, data: TutorApplicationCreateRequest) => {
    return api.put<SingleItemResponse<TutorApplication>>(
      API_ENDPOINTS.updateTutorApplication(id), 
      data
    );
  },
  
  // Delete a tutor application
  deleteTutorApplication: async (id: string) => {
    return api.delete<string >(
      API_ENDPOINTS.deleteTutorApplication(id)
    );
  }
};