import { create } from "zustand";
import { subjectsApi } from "@/api/subject";
import { Subject } from "@/types";

interface SubjectState {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
  fetchSubjects: (page?: number, limit?: number) => Promise<void>;
  getSubjectById: (id: string) => Subject | undefined;
  clearError: () => void;
}

export const useSubjectStore = create<SubjectState>((set, get) => ({
  subjects: [],
  loading: false,
  error: null,
  pagination: {
    
    currentPage: 1,
    totalItems: 0,
    totalPages: 0
  },
  
  fetchSubjects: async (currentPage = 1, limit = 20) => {
    set({ loading: true, error: null });
    try {
      const response = await subjectsApi.getSubjects(currentPage, limit) ;

      if (response.data) {
        set({ 
          subjects:response.data || [],
          pagination: {
          currentPage,
          totalItems: 5,
          totalPages: 1
          },
          loading: false
          
        });
      } else {
        set({ 
          loading: false, 
          error: response.message || "Failed to fetch subjects" 
        });
      }
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || "Failed to fetch subjects" 
      });
    }
  },
  
  getSubjectById: (id) => {
     
    return get().subjects.find(subject => subject.subjectId === id);
  },
  
  clearError: () => set({ error: null })
}));