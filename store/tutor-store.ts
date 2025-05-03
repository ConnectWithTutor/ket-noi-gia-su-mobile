import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TutorProfile } from '@/types/tutor';

interface TutorState {
  tutors: TutorProfile[];
  isLoading: boolean;
  error: string | null;
}

interface TutorStore extends TutorState {
  fetchTutors: () => Promise<void>;
  getTutorById: (id: string) => TutorProfile | undefined;
  searchTutors: (query: string) => TutorProfile[];
  filterTutorsBySubject: (subject: string) => TutorProfile[];
}

export const useTutorStore = create<TutorStore>()(
  persist(
    (set, get) => ({
      tutors: [],
      isLoading: false,
      error: null,

      fetchTutors: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Mock tutors data
          const mockTutors: TutorProfile[] = [
            {
              id: '1',
              name: 'Nguyễn Văn A',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
              bio: 'Tôi là giáo viên Toán với hơn 5 năm kinh nghiệm giảng dạy. Tôi đã giúp nhiều học sinh đạt điểm cao trong kỳ thi đại học.',
              subjects: ['Toán', 'Lý', 'Hóa'],
              education: 'Thạc sĩ Toán học, Đại học Khoa học Tự nhiên TP.HCM',
              experience: [
                'Giáo viên Toán tại Trường THPT Nguyễn Thị Minh Khai (2018-2023)',
                'Gia sư Toán, Lý, Hóa cho học sinh THPT (2016-hiện tại)'
              ],
              rating: 4.9,
              reviewCount: 27,
              hourlyRate: 200000,
              availability: 'Thứ 2-6 (18:00-21:00), Thứ 7-CN (9:00-18:00)',
              location: 'Quận 1, TP.HCM',
              contactInfo: {
                email: 'nguyenvana@example.com',
                phone: '0901234567'
              }
            },
            {
              id: '2',
              name: 'Trần Thị B',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
              bio: 'Giáo viên Tiếng Anh với chứng chỉ IELTS 8.0. Tôi chuyên dạy Tiếng Anh giao tiếp và luyện thi IELTS.',
              subjects: ['Tiếng Anh'],
              education: 'Cử nhân Ngôn ngữ Anh, Đại học Ngoại ngữ Hà Nội',
              experience: [
                'Giáo viên Tiếng Anh tại Trung tâm Anh ngữ XYZ (2019-hiện tại)',
                'Gia sư Tiếng Anh cho học sinh các cấp (2017-hiện tại)'
              ],
              rating: 4.8,
              reviewCount: 35,
              hourlyRate: 250000,
              availability: 'Thứ 3, 5, 7 (17:00-21:00)',
              location: 'Quận 3, TP.HCM'
            },
            {
              id: '3',
              name: 'Lê Văn C',
              avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
              bio: 'Sinh viên năm cuối ngành Vật lý, Đại học Khoa học Tự nhiên. Tôi có kinh nghiệm dạy Vật lý cho học sinh THPT.',
              subjects: ['Vật lý'],
              education: 'Sinh viên năm cuối ngành Vật lý, Đại học Khoa học Tự nhiên TP.HCM',
              experience: [
                'Gia sư Vật lý cho học sinh THPT (2020-hiện tại)',
                'Trợ giảng môn Vật lý đại cương tại trường (2021-hiện tại)'
              ],
              rating: 4.7,
              reviewCount: 18,
              hourlyRate: 180000,
              availability: 'Thứ 2, 4, 6 (18:00-21:00), Chủ nhật (9:00-18:00)',
              location: 'Quận 5, TP.HCM'
            },
            {
              id: '4',
              name: 'Phạm Thị D',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
              bio: 'Giáo viên Hóa học với 10 năm kinh nghiệm. Tôi đã giúp nhiều học sinh đạt giải trong các kỳ thi học sinh giỏi.',
              subjects: ['Hóa học'],
              education: 'Thạc sĩ Hóa học, Đại học Bách Khoa TP.HCM',
              experience: [
                'Giáo viên Hóa học tại Trường THPT Lê Quý Đôn (2013-hiện tại)',
                'Gia sư Hóa học cho học sinh THPT (2011-hiện tại)'
              ],
              rating: 4.9,
              reviewCount: 42,
              hourlyRate: 220000,
              availability: 'Thứ 3, 5 (18:00-21:00), Thứ 7 (14:00-18:00)',
              location: 'Quận 7, TP.HCM'
            },
            {
              id: '5',
              name: 'Hoàng Văn E',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
              bio: 'Giáo viên Ngữ văn với 7 năm kinh nghiệm. Tôi chuyên dạy Văn học và kỹ năng làm văn cho học sinh THCS và THPT.',
              subjects: ['Ngữ văn'],
              education: 'Cử nhân Văn học Việt Nam, Đại học Sư phạm TP.HCM',
              experience: [
                'Giáo viên Ngữ văn tại Trường THCS Nguyễn Du (2016-hiện tại)',
                'Gia sư Ngữ văn cho học sinh THCS và THPT (2014-hiện tại)'
              ],
              rating: 4.6,
              reviewCount: 23,
              hourlyRate: 190000,
              availability: 'Thứ 2, 4, 6 (18:00-21:00)',
              location: 'Quận 10, TP.HCM'
            }
          ];
          
          set({ tutors: mockTutors, isLoading: false });
        } catch (error) {
          set({ 
            error: "Không thể tải danh sách gia sư. Vui lòng thử lại sau.", 
            isLoading: false 
          });
        }
      },

      getTutorById: (id) => {
        return get().tutors.find(tutor => tutor.id === id);
      },

      searchTutors: (query) => {
        const { tutors } = get();
        if (!query) return tutors;
        
        const lowerCaseQuery = query.toLowerCase();
        return tutors.filter(tutor => 
          tutor.name.toLowerCase().includes(lowerCaseQuery) ||
          tutor.subjects.some(subject => subject.toLowerCase().includes(lowerCaseQuery)) ||
          tutor.bio.toLowerCase().includes(lowerCaseQuery) ||
          tutor.location.toLowerCase().includes(lowerCaseQuery)
        );
      },

      filterTutorsBySubject: (subject) => {
        const { tutors } = get();
        if (!subject) return tutors;
        
        return tutors.filter(tutor => 
          tutor.subjects.some(s => s.toLowerCase() === subject.toLowerCase())
        );
      },
    }),
    {
      name: 'tutor-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);