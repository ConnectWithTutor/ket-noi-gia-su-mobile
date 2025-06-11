import { create } from "zustand";
import { studentRequestsApi } from "@/api/studentRequests";
import { 
  StudentRequest, 
  StudentRequestCreateRequest, 
  StudentRequestUpdateRequest, 
  Status,
  PaginatedResponse,
} from "@/types";
import { StatusApi } from "@/api/status";

interface StudentRequestState {
  requests: StudentRequest[];
  myRequests: StudentRequest[];
  recentRequests: StudentRequest[];
  selectedRequest: StudentRequest | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  fetchStudentRequests: (page?: number, limit?: number) => Promise<void>;
  fetchRecentStudentRequests: (limit?: number) => Promise<void>;
  fetchMyStudentRequests: (userId:string,page?: number, limit?: number) => Promise<void>;
  fetchStudentRequestById: (id: string) => Promise<void>;
  createStudentRequest: (data: StudentRequestCreateRequest) => Promise<boolean>;
  updateStudentRequest: (id: string, data: StudentRequestUpdateRequest) => Promise<boolean>;
  deleteStudentRequest: (id: string) => Promise<boolean>;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
  clearError: () => void;
}

export const useStudentRequestStore = create<StudentRequestState>((set, get) => ({
  requests: [],
  myRequests: [],
  recentRequests: [],
  selectedRequest: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
 
  fetchStudentRequests: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });

    try {
      const response = await studentRequestsApi.getStudentRequests(page, limit);
      if (response.data) {
        const paginatedData = response as PaginatedResponse<StudentRequest>;
        const newRequests = paginatedData.data || [];
        
        set(state => {
          // Lọc ra các item mới hoặc có status thay đổi
          const updatedRequests = state.requests.map(existingItem => {
        const found = newRequests.find(newItem => newItem.requestId === existingItem.requestId);
        if (found) {
          // Nếu status thay đổi thì cập nhật
          if (found.status !== existingItem.status) {
            return { ...existingItem, ...found };
          }
          return existingItem;
        }
        return existingItem;
          });

          // Thêm các item mới chưa có trong state.requests
          const filteredNewRequests = newRequests.filter(newItem =>
        !state.requests.some(existingItem => existingItem.requestId === newItem.requestId)
          );

          return {
        requests: [...updatedRequests, ...filteredNewRequests],
        pagination: {
          page: paginatedData.pagination.currentPage,
          limit: limit,
          total: paginatedData.pagination.totalItems,
          totalPages: paginatedData.pagination.totalPages
        },
        loading: false
          };
        });

      } else {
        set({ 
          loading: false, 
          error: response.detail?.msg || "Không thể lấy danh sách yêu cầu học sinh" 
        });
      }
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || "Không thể lấy danh sách yêu cầu học sinh" 
      });
    }
  },
  
  fetchRecentStudentRequests: async (limit = 4) => {
    set({ loading: true, error: null });
    try {
      const response = await studentRequestsApi.getStudentRequests();
      const sortedData = response.data.sort((a: StudentRequest, b: StudentRequest) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      if (response.data) {
        set({ 
          recentRequests: sortedData.slice(0, 3) || [],
          loading: false
        });
      } else {
        set({ 
          loading: false, 
          error: response.message || "Không thể lấy danh sách yêu cầu gần đây" 
        });
      }
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || "Không thể lấy danh sách yêu cầu gần đây" 
      });
    }
  },
  
  fetchMyStudentRequests: async (id ,page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      
      const response = await studentRequestsApi.getMyStudentRequests(id,page, limit);
      if ( response.data) {
        set({ 
          myRequests: response.data || [],
          loading: false
        });
      } else {
        set({ 
          loading: false, 
          error: response.detail?.msg || "Không thể lấy danh sách yêu cầu của bạn" 
        });
      }
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || "Không thể lấy danh sách yêu cầu của bạn" 
      });
    }
  },
  
  fetchStudentRequestById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await studentRequestsApi.getStudentRequestById(id);
      if (response.data) {
        set({ 
          selectedRequest: response.data,
          loading: false
        });
      } else {
        set({ 
          loading: false, 
          error: response.detail?.msg || "Không thể lấy thông tin yêu cầu học sinh" 
        });
      }
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || "Không thể lấy thông tin yêu cầu học sinh" 
      });
    }
  },
  
  createStudentRequest: async (data) => {
    set({ loading: true, error: null });
    try {
      const statusResponse = await StatusApi.getStatusStudentRequest(1, 20) ; 
      const statusList = Array.isArray(statusResponse.data) ? (statusResponse.data as Status[]) : [];
      const pendingStatus: Status | undefined = statusList.find(
    (status) => status.code.toLowerCase() === "pending"
      );

      const response = await studentRequestsApi.createStudentRequest({
        ...data,
        status: pendingStatus?.statusId || ""
      });
      if (response) {
        await get().fetchMyStudentRequests(data.studentId,1, 10);
        set({ loading: false });
        return true;
      } else {
        set({
          loading: false, 
          error: statusResponse.detail?.msg || "Không thể tạo yêu cầu học sinh"
        });
        return false;
      }
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || "Không thể tạo yêu cầu học sinh" 
      });
      return false;
    }
  },
  
  updateStudentRequest: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await studentRequestsApi.updateStudentRequest(id, data);
      if (response.data) {
        set(state => ({
          myRequests: state.myRequests.map(r => 
            r.requestId === id ? { ...r, ...response.data } : r
          ),
          requests: state.requests.map(r => 
            r.requestId === id ? { ...r, ...response.data } : r
          ),
          selectedRequest: state.selectedRequest?.requestId === id 
            ? { ...state.selectedRequest, ...response.data } 
            : state.selectedRequest,
          loading: false
        }));
        return true;
      } else {
        set({ 
          loading: false, 
          error: response.detail?.msg || "Không thể cập nhật yêu cầu học sinh" 
        });
        return false;
      }
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || "Không thể cập nhật yêu cầu học sinh" 
      });
      return false;
    }
  },
  closeStudentRequest: async (id:string) => {
    set({ loading: true, error: null });
    try {
      const statusResponse = await StatusApi.getStatusStudentRequest(1, 20) ;
      const statusList = Array.isArray(statusResponse.data) ? (statusResponse.data as Status[]) : [];
      const closedStatus: Status | undefined = statusList.find(
        (status) => status.code.toLowerCase() === "Cancelled"
      );
      const response = await studentRequestsApi.updateStudentRequest(id, { status: closedStatus?.statusId });
      if (response.success) {
        set(state => ({
          myRequests: state.myRequests.filter(r => r.requestId !== id),
          requests: state.requests.filter(r => r.requestId !== id),
          selectedRequest: state.selectedRequest?.requestId === id ? null : state.selectedRequest,
          loading: false
        }));
        return true;
      } else {
        set({ 
          loading: false, 
          error: response.detail?.msg || "Không thể đóng yêu cầu học sinh" 
        });
        return false;
      }
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || "Không thể đóng yêu cầu học sinh" 
      });
      return false;
    }
  },
  deleteStudentRequest: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await studentRequestsApi.deleteStudentRequest(id);
      if (response.success) {
        set(state => ({
          myRequests: state.myRequests.filter(r => r.requestId !== id),
          requests: state.requests.filter(r => r.requestId !== id),
          selectedRequest: state.selectedRequest?.requestId === id ? null : state.selectedRequest,
          loading: false
        }));
        return true;
      } else {
        set({ 
          loading: false, 
          error: response.detail?.msg || "Không thể xóa yêu cầu học sinh" 
        });
        return false;
      }
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || "Không thể xóa yêu cầu học sinh" 
      });
      return false;
    }
  },
  
  nextPage: async () => {
    const { pagination } = get();
    if (pagination.page < pagination.totalPages) {
      await get().fetchStudentRequests(pagination.page + 1);
    }
  },
  
  prevPage: async () => {
    const { pagination } = get();
    if (pagination.page > 1) {
      await get().fetchStudentRequests(pagination.page - 1);
    }
  },
  
  clearError: () => set({ error: null })
}));
