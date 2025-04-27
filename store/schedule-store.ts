import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Class, ClassStatus } from '@/types/schedule';

interface ScheduleState {
  classes: Class[];
  isLoading: boolean;
  error: string | null;
}

interface ScheduleStore extends ScheduleState {
  fetchClasses: () => Promise<void>;
  addClass: (classData: Omit<Class, 'id'>) => Promise<void>;
  updateClass: (id: string, classData: Partial<Class>) => Promise<void>;
  cancelClass: (id: string) => Promise<void>;
  getClassesByDate: (date: Date) => Class[];
}

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      classes: [],
      isLoading: false,
      error: null,

      fetchClasses: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Mock classes data
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          const mockClasses: Class[] = [
            {
              id: '1',
              title: 'Tiếng Anh - Lớp Ngoại Ngữ',
              tutorId: '2',
              tutorName: 'Nguyễn Văn A',
              studentId: '1',
              studentName: 'Bạch Minh Tuyên',
              subject: 'Tiếng Anh',
              startTime: new Date(today.setHours(9, 0, 0)).toISOString(),
              endTime: new Date(today.setHours(10, 30, 0)).toISOString(),
              location: 'Phòng 101',
              status: 'upcoming',
            },
            {
              id: '2',
              title: 'Đại Số - Lớp Toán',
              tutorId: '3',
              tutorName: 'Lê Thị B',
              studentId: '1',
              studentName: 'Bạch Minh Tuyên',
              subject: 'Toán',
              startTime: new Date(tomorrow.setHours(13, 0, 0)).toISOString(),
              endTime: new Date(tomorrow.setHours(15, 0, 0)).toISOString(),
              location: 'Phòng 202',
              status: 'upcoming',
            },
            {
              id: '3',
              title: 'Vật Lý - Cơ Học',
              tutorId: '4',
              tutorName: 'Trần Văn C',
              studentId: '1',
              studentName: 'Bạch Minh Tuyên',
              subject: 'Vật Lý',
              startTime: new Date(today.setHours(15, 30, 0)).toISOString(),
              endTime: new Date(today.setHours(17, 0, 0)).toISOString(),
              location: 'Phòng 303',
              status: 'upcoming',
            },
          ];
          
          set({ classes: mockClasses, isLoading: false });
        } catch (error) {
          set({ 
            error: "Không thể tải lịch học. Vui lòng thử lại sau.", 
            isLoading: false 
          });
        }
      },

      addClass: async (classData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          const newClass: Class = {
            id: Date.now().toString(),
            ...classData,
          };
          
          set((state) => ({
            classes: [...state.classes, newClass],
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: "Không thể thêm lớp học. Vui lòng thử lại sau.", 
            isLoading: false 
          });
        }
      },

      updateClass: async (id, classData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          set((state) => ({
            classes: state.classes.map((c) => 
              c.id === id ? { ...c, ...classData } : c
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: "Không thể cập nhật lớp học. Vui lòng thử lại sau.", 
            isLoading: false 
          });
        }
      },

      cancelClass: async (id) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          set((state) => ({
            classes: state.classes.map((c) => 
              c.id === id ? { ...c, status: 'cancelled' as ClassStatus } : c
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: "Không thể hủy lớp học. Vui lòng thử lại sau.", 
            isLoading: false 
          });
        }
      },

      getClassesByDate: (date) => {
        const { classes } = get();
        return classes.filter((c) => {
          const classDate = new Date(c.startTime);
          return (
            classDate.getDate() === date.getDate() &&
            classDate.getMonth() === date.getMonth() &&
            classDate.getFullYear() === date.getFullYear()
          );
        });
      },
    }),
    {
      name: 'schedule-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);