import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Class, ClassCreateRequest } from '@/types/class';
import { ClassRegistrationCreateRequest } from '@/types/class-registration';
import { classApi } from '@/api/class';
import { useAuthStore } from './auth-store';
import { Evaluation, EvaluationCreateRequest } from '@/types';

interface ClassState {
  classes: Class[];
  Myclasses: Class[];
  Evaluations: Evaluation[];
  selectedClass: Class | null;
  isLoading: boolean;
  error: string | null;
  message: string | null;
}

interface ClassStore extends ClassState {
  fetchClasses: () => Promise<void>;
  fetchClassById: (id: string) => Promise<Class | null>;
  fetchClassesByUserId: (userId: string) => Promise<void>;
  findBestClasses: (params: {
    keyword: string;
    limit: number;
  }) => Promise<void>;
  createClass: (classData: ClassCreateRequest) => Promise<string | null>;
  updateClass: (id: string, classData: Partial<Class>) => Promise<boolean>;
  deleteClass: (id: string) => Promise<boolean>;
  registerStudent: (registrationData: ClassRegistrationCreateRequest) => Promise<boolean>;
  setSelectedClass: (classData: Class | null) => void;
  rateClass: (classId: string, rating1: number, rating2: number, rating3: number, comment: string) => Promise<boolean>;
  getClassEvaluationsByUserId: (userId: string) => Promise<Evaluation[]>;
  getAllEvaluations: () => Promise<Evaluation[]>;
}

export const useClassStore = create<ClassStore>()(
  persist(
    (set, get) => ({
      classes: [],
      Myclasses: [],
      Evaluations: [],
      selectedClass: null,
      isLoading: false,
      error: null,
      message: null,

     fetchClasses: async () => {
             set({ isLoading: true, error: null });
             try {
               const response = await classApi.getClass();
               if ( response.data) {
               set({ classes: response.data, isLoading: false });
               }
             } catch (error) {
               set({ 
                 error: "Không thể tải lịch học. Vui lòng thử lại sau.", 
                 isLoading: false 
               });
             }
           },

      fetchClassById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          const response = await classApi.getClassById(id);
          if (response.data) {
            set({ selectedClass: response.data, isLoading: false });
            return response.data;
          }
          else {
            set({ 
              error: "Không tìm thấy lớp học.", 
              isLoading: false 
            });
            return null;
          }
        } catch (error) {
          set({ 
            error: "Không thể tải thông tin lớp học. Vui lòng thử lại sau.", 
            isLoading: false 
          });
          return null;
        }
      },
      fetchClassesByUserId: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await classApi.getClassByUser(userId);
          if (response.data) {
            set({ Myclasses: response.data, isLoading: false });
          } else {
            set({
              error: "Không tìm thấy lớp học của người dùng.",
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: "Không thể tải lớp học của người dùng. Vui lòng thử lại sau.",
            isLoading: false,
          });
        }
      },
      findBestClasses: async ({
        keyword,
        limit,
      }: {
        keyword: string;
        limit: number;
      }) => {
        set({ isLoading: true, error: null });
        try {
            const userId = useAuthStore.getState().user?.userId;
            const response = await classApi.findBestClasses({ keyword, userId, limit });
          if (response.results) {
            set({ classes: response.results.map(result => result.class_), isLoading: false , message:null });
          } else {
            set({
              message: response.message || "Không tìm thấy lớp học phù hợp.",
              classes: [],
              error: "Không tìm thấy lớp học phù hợp.",
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: "Không thể tìm kiếm lớp học. Vui lòng thử lại sau.",
            isLoading: false,
          });
        }
      },
      createClass: async (classData: ClassCreateRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await classApi.createClass(classData);
          if (response.id) {
            // Lấy thông tin lớp học mới tạo từ API và cập nhật selectedClass
            await get().fetchClassById(response.id);
           set({
            isLoading: false,
          });
          return response.id;
          }
          else {
            set({ 
              error: "Không thể tạo lớp học. Vui lòng thử lại sau.", 
              isLoading: false 
            });
            return null;
          }
        } catch (error) {
          set({ 
            error: "Không thể tạo lớp học. Vui lòng thử lại sau.", 
            isLoading: false 
          });
          return null;
        }
      },
      rateClass: async (classId: string, rating1: number, rating2: number, rating3: number, comment: string) => {
        set({ isLoading: true, error: null });
        try {
          const Data: EvaluationCreateRequest = {
            classId,
            fromUserId: useAuthStore.getState().user?.userId || '',
            criteria1: rating1,
            criteria2: rating2,
            criteria3: rating3,
            comment,
          };
          const response = await classApi.rateClass(Data);
          if (response.id) {
            set((state) => ({
              isLoading: false,
            }));
            return true;
          } else {
            set({ 
              error: "Không thể đánh giá lớp học. Vui lòng thử lại sau.", 
              isLoading: false 
            });
            return false;
          }
        } catch (error) {
          set({ 
            error: "Không thể đánh giá lớp học. Vui lòng thử lại sau.", 
            isLoading: false 
          });
          return false;
        }
      },
      getAllEvaluations: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await classApi.getAllEvaluations();
          if (response.data) {
            set({ isLoading: false });
            return response.data;
          } else {
            set({
              error: "Không tìm thấy đánh giá nào.",
              isLoading: false,
            });
            return [];
          }
        } catch (error) {
          set({
            error: "Không thể tải đánh giá. Vui lòng thử lại sau.",
            isLoading: false,
          });
        }
        return [];
      },
      updateClass: async (id: string, classData: Partial<Class>) => {
        set({ isLoading: true, error: null });
        try {
          
          const response = await classApi.updateClass(id, classData);
          if (!response) {
            set({ 
              error: "Không thể cập nhật lớp học. Vui lòng thử lại sau.", 
              isLoading: false 
            });
            return false;
          }
          
          set((state) => {
            const updatedClasses = state.classes.map((c) => 
              c.classId === id ? { ...c, ...classData } : c
            );
            
            const updatedClass = updatedClasses.find(c => c.classId === id) || null;
            
            return {
              classes: updatedClasses,
              selectedClass: state.selectedClass?.classId === id ? updatedClass : state.selectedClass,
              isLoading: false,
            };
          });
          
          return true;
        } catch (error) {
          set({ 
            error: "Không thể cập nhật lớp học. Vui lòng thử lại sau.", 
            isLoading: false 
          });
          return false;
        }
      },
      getClassEvaluationsByUserId: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          const response = await classApi.getClassEvaluationsByUserId(userId);
          if (response.data) {
            set({ Evaluations: response.data, isLoading: false });
          } else {
            set({
              error: "Không tìm thấy đánh giá của người dùng.",
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: "Không thể tải đánh giá của người dùng. Vui lòng thử lại sau.",
            isLoading: false,
          });
        }
        return [];
      },
      deleteClass: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          set((state) => ({
            classes: state.classes.filter(c => c.classId !== id),
            selectedClass: state.selectedClass?.classId === id ? null : state.selectedClass,
            isLoading: false,
          }));
          
          return true;
        } catch (error) {
          set({ 
            error: "Không thể xóa lớp học. Vui lòng thử lại sau.", 
            isLoading: false 
          });
          return false;
        }
      },

      registerStudent: async (registrationData: ClassRegistrationCreateRequest) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // In a real app, you would update the class with the new student
          // For now, we'll just return success
          set({ isLoading: false });
          return true;
        } catch (error) {
          set({ 
            error: "Không thể đăng ký học viên. Vui lòng thử lại sau.", 
            isLoading: false 
          });
          return false;
        }
      },

      setSelectedClass: (classData: Class | null) => {
        set({ selectedClass: classData });
      },
    }),
    {
      name: 'class-storage',

      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);


