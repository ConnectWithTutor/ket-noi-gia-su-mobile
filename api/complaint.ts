import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { PaginatedResponse, Complaint, CreateComplaintRequest,complaintType, CreateResponse,ClassCreateRequest } from "@/types";

export const complaintApi = {
    getComplaints: async (page = 1, limit = 20) => {
        return api.get<PaginatedResponse<Complaint>>(`${API_ENDPOINTS.complaints}?page=${page}&limit=${limit}`);
    },
    getComplaintsByStatus: async (status_name: string, page = 1, limit = 20) => {
        return api.get<PaginatedResponse<Complaint>>(`${API_ENDPOINTS.complaintsByStatus(status_name)}?page=${page}&limit=${limit}`);
    },
    getComplaintById: async (complaint_id: string) => {
        return api.get<Complaint>(API_ENDPOINTS.complaintById(complaint_id));
    },
    createComplaint: async (data: Partial<CreateComplaintRequest>) => {
        return api.post<CreateResponse>(API_ENDPOINTS.createComplaint, data);
    },
    updateComplaint: async (complaint_id: string, data: Partial<CreateComplaintRequest>) => {
        return api.put<Complaint>(API_ENDPOINTS.updateComplaint(complaint_id), data);
    },
    deleteComplaint: async (complaint_id: string) => {
        return api.delete(API_ENDPOINTS.deleteComplaint(complaint_id));
    },

    // Complaint Type
    getComplaintTypes: async () => {
        return api.get<PaginatedResponse<complaintType>>(API_ENDPOINTS.complaintTypes);
    },
    getComplaintTypeById: async (type_id: string) => {
        return api.get<complaintType>(API_ENDPOINTS.complaintTypeById(type_id));
    },
    
};