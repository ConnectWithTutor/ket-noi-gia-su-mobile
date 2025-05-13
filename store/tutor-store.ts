import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tutor, TutorProfile } from '@/types/tutor';
import { usersApi } from '@/api/user';
import { rolesApi } from '@/api/roles';
import { User,Role } from '@/types';
import { tutorApi } from '@/api/tutor';


interface TutorState {
  tutors: Tutor[];
  isLoading: boolean;
  error: string | null;
  users: User[];
}

interface TutorStore extends TutorState {
  fetchTutors: () => Promise<void>;
  getTutorById: (id: string) => Promise<TutorProfile | undefined>;
  searchTutors: (query: string) => Promise<User[] | undefined>;
}

export const useTutorStore = create<TutorStore>()(
  persist(
    (set, get) => ({
      tutors: [],
      isLoading: false,
      error: null,
      users: [],

      fetchTutors: async () => {
        set({ isLoading: true, error: null });
        
        try {
            const res =  await usersApi.getAllUsers();
            const role = await rolesApi.getRoles();
            
            if (!res || !role) {
              set({ error: "Không thể tải danh sách gia sư. Vui lòng thử lại sau.", isLoading: false });
              return;
            }
            const users = res.data || [];
            const roles = role.data || [];
            const tutorRole = roles.find((r: Role) => r.roleName === 'Tutor');
            const mockTutors = users
              .filter((user: User) => user.roleId === tutorRole?.roleId)
          set({ users: mockTutors, isLoading: false });
        } catch (error) {
          set({ 
            error: "Không thể tải danh sách gia sư. Vui lòng thử lại sau.", 
            isLoading: false 
          });
        }
      },


      getTutorById: async (id) => {
        try {
          const respon = await tutorApi.tutorProfileById(id);
            if (respon) {
            return respon;
          } else {
            set({ error: "Không tìm thấy gia sư", isLoading: false });
            return undefined;
          }
        } catch (error) {
          set({ error: "Không tìm thấy gia sư", isLoading: false });
          return undefined;
        }
      },

      searchTutors:  async (query) => {
        set({ isLoading: true, error: null });
        try {
          const { users } = get();
          if (!query) return users;
          const lowerCaseQuery = query.toLowerCase();
          const search =  users.filter(users => 
            users.fullName.toLowerCase().includes(lowerCaseQuery) 
          )
          set({ users: search, isLoading: false });
         } catch (error) {
          set({ 
            error: "Không tìm thấy gia sư nào", 
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'tutor-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);