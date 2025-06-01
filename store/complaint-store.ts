import { create } from "zustand";
import { complaintApi } from "@/api/complaint";
import { Complaint, complaintType, PaginatedResponse, CreateComplaintRequest, CreateResponse } from "@/types";

interface ComplaintPagination {
    page: number;
    total: number;
    totalPages: number;
}

interface ComplaintState {
    complaints: Complaint[];
    complaintTypes: complaintType[];
    loading: boolean;
    error: string | null;
    pagination: ComplaintPagination;
    selectedComplaint: Complaint | null;
    fetchComplaints: (page?: number, limit?: number) => Promise<void>;
    fetchComplaintsByStatus: (status: string, page?: number, limit?: number) => Promise<void>;
    getComplaintById: (id: string) => Promise<Complaint | undefined>;
    createComplaint: (data: Partial<CreateComplaintRequest>) => Promise<CreateResponse | undefined>;
    updateComplaint: (id: string, data: Partial<CreateComplaintRequest>) => Promise<Complaint | undefined>;
    deleteComplaint: (id: string) => Promise<void>;
    fetchComplaintTypes: () => Promise<void>;
    getComplaintTypeById: (id: string) => Promise<complaintType | undefined>;
    clearError: () => void;
}

export const useComplaintStore = create<ComplaintState>((set, get) => ({
    complaints: [],
    complaintTypes: [],
    loading: false,
    error: null,
    selectedComplaint: null,
    pagination: {
        page: 1,
        total: 0,
        totalPages: 0,
    },

    fetchComplaints: async (page = 1, limit = 20) => {
        set({ loading: true, error: null });
        try {
            const res = await complaintApi.getComplaints(page, limit);
            if (res.data) {
                set({
                    complaints: res.data,
                    pagination: {
                        page: res.pagination.currentPage,
                        total: res.pagination.totalItems,
                        totalPages: res.pagination.totalPages,
                    },
                    loading: false,
                });
            } else {
                set({ loading: false, error: "Failed to fetch complaints" });
            }
        } catch (error: any) {
            set({ loading: false, error: error.message || "Failed to fetch complaints" });
        }
    },

    fetchComplaintsByStatus: async (status, page = 1, limit = 20) => {
        set({ loading: true, error: null });
        try {
            const res = await complaintApi.getComplaintsByStatus(status, page, limit);
            if (res.data) {
                set({
                   complaints: res.data,
                    pagination: {
                        page: res.pagination.currentPage,
                        total: res.pagination.totalItems,
                        totalPages: res.pagination.totalPages,
                    },
                    loading: false,
                });
            } else {
                set({ loading: false, error: "Failed to fetch complaints by status" });
            }
        } catch (error: any) {
            set({ loading: false, error: error.message || "Failed to fetch complaints by status" });
        }
    },

    getComplaintById: async (id) => {
        try {
            if (!id) return undefined;
            const res = await complaintApi.getComplaintById(id);
            set({ selectedComplaint: res }); // Cập nhật selectedComplaint
            return res;
        } catch {
            set({ error: "Failed to fetch complaint by ID", selectedComplaint: null });
            return undefined;
        }
    },

    createComplaint: async (data) => {
        try {
            const res = await complaintApi.createComplaint(data);
            return res;
        } catch {
            set({ error: "Failed to create complaint" });
            return undefined;
        }
    },

    updateComplaint: async (id, data) => {
        try {
            const res = await complaintApi.updateComplaint(id, data);
            return res;
        } catch {
            set({ error: "Failed to update complaint" });
            return undefined;
        }
    },

    deleteComplaint: async (id) => {
        try {
            await complaintApi.deleteComplaint(id);
            // Optionally refetch complaints or remove from state
        } catch {
            set({ error: "Failed to delete complaint" });
        }
    },

    fetchComplaintTypes: async () => {
        set({ loading: true, error: null });
        try {
            const res = await complaintApi.getComplaintTypes();
            set({ complaintTypes: res.data, loading: false });
        } catch (error: any) {
            set({ loading: false, error: error.message || "Failed to fetch complaint types" });
        }
    },

    getComplaintTypeById: async (id) => {
        try {
            const res = await complaintApi.getComplaintTypeById(id);
            return res;
        } catch {
            set({ error: "Failed to fetch complaint type by ID" });
            return undefined;
        }
    },

    

    clearError: () => set({ error: null }),
}));