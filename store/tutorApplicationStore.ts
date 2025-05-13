import { create } from "zustand";
import { tutorApplicationsApi } from "@/api/tutorApplications";
import { Status, TutorApplication, TutorApplicationCreateRequest } from "@/types";
import { StatusApi } from "@/api/status";

interface TutorApplicationState {
  applications: TutorApplication[];
  currentApplication: TutorApplication | null;
  isLoading: boolean;
  error: string | null;
  totalApplications: number;
  currentPage: number;
  limit: number;
  
  // Fetch all applications
  fetchApplications: (page?: number, limit?: number) => Promise<void>;
  
  // Fetch applications by user
  fetchApplicationsByUser: (userId: string, page?: number, limit?: number) => Promise<void>;
  
  // Fetch applications by request
  fetchApplicationsByRequest: (requestId: string, page?: number, limit?: number) => Promise<void>;
  
  // Fetch a single application
  fetchApplication: (applicationId: string) => Promise<void>;
  
  // Create a new application
  createApplication: (data:any) => Promise<boolean>;
  
  // Update an application
  updateApplication: (id: string, data: TutorApplicationCreateRequest) => Promise<TutorApplication | null>;
  
  // Delete an application
  deleteApplication: (id: string) => Promise<boolean>;
  
  // Clear current application
  clearCurrentApplication: () => void;
  
  // Clear error
  clearError: () => void;
}

export const useTutorApplicationStore = create<TutorApplicationState>((set, get) => ({
  applications: [],
  currentApplication: null,
  isLoading: false,
  error: null,
  totalApplications: 0,
  currentPage: 1,
  limit: 10,
  
  fetchApplications: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tutorApplicationsApi.getTutorApplications(page, limit);
      if (response.data) {
        set({
          applications: response.data,
          totalApplications: response.pagination.totalItems,
          currentPage: page,
          limit,
          isLoading: false
        });
      } else {
        set({ 
          error: response.message || "Failed to fetch applications", 
          isLoading: false 
        });
      }
    } catch (error: any) {
      set({ 
        error: error.message || "Failed to fetch applications", 
        isLoading: false 
      });
    }
  },
  
  fetchApplicationsByUser: async (userId: string, page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tutorApplicationsApi.getTutorApplicationsByUser(userId, page, limit);
      if (response.success && response.data) {
        set({
          applications: response.data,
          totalApplications: response.pagination.totalItems,
          currentPage: page,
          limit,
          isLoading: false
        });
      } else {
        set({ 
          error: response.message || "Failed to fetch applications", 
          isLoading: false 
        });
      }
    } catch (error: any) {
      set({ 
        error: error.message || "Failed to fetch applications", 
        isLoading: false 
      });
    }
  },
  
  fetchApplicationsByRequest: async (requestId: string, page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tutorApplicationsApi.getTutorApplicationsByRequest(requestId, page, limit);
      if (response.data) {
       
        set({
          
          applications: response.data,
          totalApplications: response.pagination.totalItems,
          currentPage: page,
          limit,
          isLoading: false
        });
      } else {
        set({ 
          error: response.message || "Failed to fetch applications", 
          isLoading: false 
        });
      }
    } catch (error: any) {
      set({ 
        error: error.message || "Failed to fetch applications", 
        isLoading: false 
      });
    }
  },
  
  fetchApplication: async (applicationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tutorApplicationsApi.getTutorApplication(applicationId);
      if (response.data) {
        set({
          currentApplication: response.data,
          isLoading: false
        });
      } else {
        set({ 
          error: response.detail?.msg || "Failed to fetch application", 
          isLoading: false 
        });
      }
    } catch (error: any) {
      set({ 
        error: error.message || "Failed to fetch application", 
        isLoading: false 
      });
    }
  },
  
  createApplication: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const statusResponse = await StatusApi.getStatusTutorApplication(1, 20) ; 
      const statusList = Array.isArray(statusResponse.data) ? (statusResponse.data as Status[]) : [];
      const pendingStatus: Status | undefined = statusList.find(
    (status) => status.code.toLowerCase() === "pending"
      );
     const dataI = {
        ...data,
        applicationDate: new Date().toISOString(),
        status: pendingStatus?.statusId || ""
      };

      const response = await tutorApplicationsApi.createTutorApplication(dataI);
      if (response) {
        set({
          isLoading: false
        });
        return true ;
      } else {
        set({ 
          error:"Failed to create application", 
          isLoading: false 
        });
        return false;
      }
    } catch (error: any) {
      set({ 
        error: error.message || "Failed to create application", 
        isLoading: false 
      });
      return false;
    }
  },
  
  updateApplication: async (id: string, data: TutorApplicationCreateRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tutorApplicationsApi.updateTutorApplication(id, data);
      if ( response.data) {
        const updatedApplications = get().applications.map(app => 
          app.applicationId === id ? response.data : app
        );
        
        set({
          applications: updatedApplications.filter((app): app is TutorApplication => app !== undefined),
          currentApplication: response.data,
          isLoading: false
        });
        return response.data;
      } else {
        set({ 
          error: response.detail?.msg || "Failed to update application", 
          isLoading: false 
        });
        return null;
      }
    } catch (error: any) {
      set({ 
        error: error.message || "Failed to update application", 
        isLoading: false 
      });
      return null;
    }
  },
  
  deleteApplication: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tutorApplicationsApi.deleteTutorApplication(id);
      if (response) {
        const updatedApplications = get().applications.filter(
          app => app.applicationId !== id
        );
        
        set({
          applications: updatedApplications,
          currentApplication: null,
          isLoading: false
        });
        return true;
      } else {
        set({ 
          error: response || "Failed to delete application", 
          isLoading: false 
        });
        return false;
      }
    } catch (error: any) {
      set({ 
        error: error.message || "Failed to delete application", 
        isLoading: false 
      });
      return false;
    }
  },
  
  clearCurrentApplication: () => {
    set({ currentApplication: null });
  },
  
  clearError: () => {
    set({ error: null });
  }
}));