import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post, PostFormData, PostStatus } from '@/types/post';

interface PostState {
  posts: Post[];
  userPosts: Post[];
  isLoading: boolean;
  error: string | null;
}

interface PostStore extends PostState {
  fetchPosts: () => Promise<void>;
  fetchUserPosts: (userId: string) => Promise<void>;
  getPostById: (id: string) => Post | undefined;
  createPost: (postData: PostFormData, userId: string, userName: string, userAvatar?: string) => Promise<Post>;
  updatePost: (id: string, postData: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  closePost: (id: string) => Promise<void>;
}

export const usePostStore = create<PostStore>()(
  persist(
    (set, get) => ({
      posts: [],
      userPosts: [],
      isLoading: false,
      error: null,

      fetchPosts: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Mock posts data
          const mockPosts: Post[] = [
            {
              id: '1',
              title: 'Cần gia sư Toán lớp 12',
              description: 'Tìm gia sư dạy Toán cho học sinh lớp 12, chuẩn bị thi đại học.',
              userId: '2',
              userName: 'Nguyễn Văn A',
              userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
              subject: 'Toán',
              studentCount: 1,
              location: 'Quận 1, TP.HCM',
              tuitionFee: 200000,
              schedule: 'Thứ 2, 4, 6 (18:00 - 20:00)',
              requirements: 'Gia sư có kinh nghiệm dạy Toán lớp 12 ít nhất 2 năm',
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'active',
              applicants: 3,
            },
            {
              id: '2',
              title: 'Tìm gia sư Tiếng Anh cho nhóm 3 học sinh',
              description: 'Cần gia sư dạy Tiếng Anh giao tiếp cho nhóm 3 học sinh cấp 2.',
              userId: '3',
              userName: 'Trần Thị B',
              userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
              subject: 'Tiếng Anh',
              studentCount: 3,
              location: 'Quận 7, TP.HCM',
              tuitionFee: 300000,
              schedule: 'Thứ 3, 5, 7 (17:00 - 19:00)',
              requirements: 'Gia sư có chứng chỉ IELTS 7.0 trở lên',
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'active',
              applicants: 5,
            },
            {
              id: '3',
              title: 'Cần gia sư Vật lý lớp 11',
              description: 'Tìm gia sư dạy Vật lý cho học sinh lớp 11, tập trung vào các bài tập nâng cao.',
              userId: '4',
              userName: 'Lê Văn C',
              userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
              subject: 'Vật lý',
              studentCount: 1,
              location: 'Quận 2, TP.HCM',
              tuitionFee: 180000,
              schedule: 'Thứ 7, Chủ nhật (9:00 - 11:00)',
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'active',
              applicants: 2,
            },
            {
              id: '4',
              title: 'Tìm gia sư Hóa học lớp 10',
              description: 'Cần gia sư dạy Hóa học cho học sinh lớp 10, giúp nâng cao điểm số.',
              userId: '5',
              userName: 'Phạm Thị D',
              userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
              subject: 'Hóa học',
              studentCount: 1,
              location: 'Quận 3, TP.HCM',
              tuitionFee: 190000,
              schedule: 'Thứ 2, 4 (19:00 - 21:00)',
              requirements: 'Gia sư là sinh viên hoặc giáo viên chuyên ngành Hóa',
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'active',
              applicants: 1,
            },
            {
              id: '5',
              title: 'Cần gia sư Ngữ văn lớp 9',
              description: 'Tìm gia sư dạy Ngữ văn cho học sinh lớp 9, chuẩn bị thi vào lớp 10.',
              userId: '6',
              userName: 'Hoàng Văn E',
              userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
              subject: 'Ngữ văn',
              studentCount: 1,
              location: 'Quận 5, TP.HCM',
              tuitionFee: 170000,
              schedule: 'Thứ 3, 5 (18:00 - 20:00)',
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'active',
              applicants: 4,
            },
          ];
          
          set({ posts: mockPosts, isLoading: false });
        } catch (error) {
          set({ 
            error: "Không thể tải danh sách bài đăng. Vui lòng thử lại sau.", 
            isLoading: false 
          });
        }
      },

      fetchUserPosts: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Filter posts by userId
          const userPosts = get().posts.filter(post => post.userId === userId);
          
          set({ userPosts, isLoading: false });
        } catch (error) {
          set({ 
            error: "Không thể tải danh sách bài đăng của bạn. Vui lòng thử lại sau.", 
            isLoading: false 
          });
        }
      },

      getPostById: (id) => {
        return get().posts.find(post => post.id === id);
      },

      createPost: async (postData, userId, userName, userAvatar) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          const newPost: Post = {
            id: Date.now().toString(),
            ...postData,
            userId,
            userName,
            userAvatar,
            createdAt: new Date().toISOString(),
            status: 'active' as PostStatus,
            applicants: 0,
          };
          
          set(state => ({
            posts: [newPost, ...state.posts],
            isLoading: false,
          }));
          
          return newPost;
        } catch (error) {
          set({ 
            error: "Không thể tạo bài đăng. Vui lòng thử lại sau.", 
            isLoading: false 
          });
          throw error;
        }
      },

      updatePost: async (id, postData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          set(state => ({
            posts: state.posts.map(post => 
              post.id === id ? { ...post, ...postData } : post
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: "Không thể cập nhật bài đăng. Vui lòng thử lại sau.", 
            isLoading: false 
          });
          throw error;
        }
      },

      deletePost: async (id) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          set(state => ({
            posts: state.posts.filter(post => post.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: "Không thể xóa bài đăng. Vui lòng thử lại sau.", 
            isLoading: false 
          });
          throw error;
        }
      },

      closePost: async (id) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          set(state => ({
            posts: state.posts.map(post => 
              post.id === id ? { ...post, status: 'closed' as PostStatus } : post
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: "Không thể đóng bài đăng. Vui lòng thử lại sau.", 
            isLoading: false 
          });
          throw error;
        }
      },
    }),
    {
      name: 'post-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);