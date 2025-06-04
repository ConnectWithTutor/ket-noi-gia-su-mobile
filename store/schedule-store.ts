import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Class } from '@/types/class';
import { Status } from '@/types/status';
import { Schedule, ScheduleCreateRequest, WeeklySchedule } from '@/types/schedule';
import { classApi } from '@/api/class';
import { scheduleApi } from '@/api/schedule';
import { router } from 'expo-router';

interface ScheduleState {
  classes: Class[];
  schedules: Schedule[];
  isLoading: boolean;
  error: string | null;
}

interface ScheduleStore extends ScheduleState {

  // getClassesByDate: (date: Date) => Class[];
  
  // New methods for schedules
  getSchedulesByClass: (classId?: string) => Promise<void>;
  createSchedule: (scheduleData: ScheduleCreateRequest) => Promise<string | null>;
  createWeeklySchedules: (scheduleData: WeeklySchedule) => Promise<boolean>;
  // updateSchedule: (id: string, scheduleData: Partial<Schedule>) => Promise<boolean>;
  // cancelSchedule: (id: string) => Promise<boolean>;
  getSchedulesByDate: (date: Date) => Schedule[];
}

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      classes: [],
      schedules: [],
      isLoading: false,
      error: null,
      // getClassesByDate: (date) => {
      //   const { schedules } = get();
      //   return schedules.filter((c) => {
      //     const classDate = new Date(c.startTime);
      //     return (
      //       classDate.getDate() === date.getDate() &&
      //       classDate.getMonth() === date.getMonth() &&
      //       classDate.getFullYear() === date.getFullYear()
      //     );
      //   });
      // },

      // New methods for schedules
      getSchedulesByClass: async (classId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          if (!classId) {
            set({ schedules: [], isLoading: false });
            return;
          }
          const response = await scheduleApi.getSchedulesByClass(classId);
          // Mock schedules data
          const today = new Date();
          const nextWeek = new Date(today);
          nextWeek.setDate(nextWeek.getDate() + 7);
          // Filter by classId if provided
          if (response.data) {
           const schedule = response.data;
            const filteredSchedules = classId 
            ? schedule.filter(s => s.classId === classId)
            : schedule;
          set({ schedules: filteredSchedules, isLoading: false });
          }
          
        } catch (error) {
          set({ 
            error: "Không thể tải lịch học. Vui lòng thử lại sau.", 
            isLoading: false 
          });
        }
      },

      createSchedule: async (scheduleData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          const response = await scheduleApi.createSchedule(scheduleData);
          if (response.detail) {
            set({ 
              error: response.detail.msg || "Không thể tạo lịch học. Vui lòng thử lại sau.", 
              isLoading: false 
            });
            return null;
          }
          set(() => ({
            isLoading: false,
          }));
          return response.id || null;
        } catch (error) {
          set({ 
            error: "Không thể tạo lịch học. Vui lòng thử lại sau.", 
            isLoading: false 
          });
          return null;
        }
      },

      createWeeklySchedules: async (scheduleData:WeeklySchedule ) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
           const response = await scheduleApi.createBulkSchedules(scheduleData);
          if (response.detail) {
            set({
              error: response.detail.msg || "Không thể tạo lịch học hàng tuần. Vui lòng thử lại sau.",
              isLoading: false
            });
            return false;
          }
          set((state) => ({
            isLoading: false,
          }));
          return true;
        } catch (error) {
          set({ 
            error: "Không thể tạo lịch học hàng tuần. Vui lòng thử lại sau.", 
            isLoading: false 
          });
          return false;
        }
      },

      // updateSchedule: async (id, scheduleData) => {
      //   set({ isLoading: true, error: null });
      //   try {
      //     // Simulate API call
      //     await new Promise((resolve) => setTimeout(resolve, 1000));
          
      //     set((state) => ({
      //       schedules: state.schedules.map((s) => 
      //         s.id === id ? { ...s, ...scheduleData } : s
      //       ),
      //       isLoading: false,
      //     }));
          
      //     return true;
      //   } catch (error) {
      //     set({ 
      //       error: "Không thể cập nhật lịch học. Vui lòng thử lại sau.", 
      //       isLoading: false 
      //     });
      //     return false;
      //   }
      // },

      // cancelSchedule: async (id) => {
      //   set({ isLoading: true, error: null });
      //   try {
      //     // Simulate API call
      //     await new Promise((resolve) => setTimeout(resolve, 1000));
          
      //     set((state) => ({
      //       schedules: state.schedules.map((s) => 
      //         s.id === id ? { ...s, status: 'cancelled' } : s
      //       ),
      //       isLoading: false,
      //     }));
          
      //     return true;
      //   } catch (error) {
      //     set({ 
      //       error: "Không thể hủy lịch học. Vui lòng thử lại sau.", 
      //       isLoading: false 
      //     });
      //     return false;
      //   }
      // },

     
      getSchedulesByDate: (date) => {
        const { schedules } = get();
        const dateString = date.toISOString().split('T')[0];
        return schedules.filter(s => s.dayStudying === dateString);
      },
    }),
    {
      name: 'schedule-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);