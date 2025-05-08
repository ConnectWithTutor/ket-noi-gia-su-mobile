import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StudentRequest, StudentRequestCreateRequest,  } from '@/types/student-request';
import { studentRequestsApi } from '@/api/studentRequests';

interface PostState {
  posts: StudentRequest[];
  userPosts: StudentRequest[];
  isLoading: boolean;
  error: string | null;
}

interface PostStore extends PostState {
  fetchPosts: () => Promise<void>;
  // fetchUserPosts: (userId: string) => Promise<void>;
  // getPostById: (id: string) => StudentRequest | undefined;
  // createPost: (postData: StudentRequestCreateRequest, userId: string, userName: string, userAvatar?: string) => Promise<StudentRequest>;
  // updatePost: (id: string, postData: Partial<StudentRequest>) => Promise<void>;
  // deletePost: (id: string) => Promise<void>;
  // closePost: (id: string) => Promise<void>;
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
          const response = await studentRequestsApi.getStudentRequests();
          console.log("Posts response:", response);
          
          set({ posts: response.data, isLoading: false });
        } catch (error) {
          set({ 
            error: "Không thể tải danh sách bài đăng. Vui lòng thử lại sau.", 
            isLoading: false 
          });
        }
      },

      // fetchUserPosts: async (userId) => {
      //   set({ isLoading: true, error: null });
      //   try {
      //     // Simulate API call
      //     await new Promise((resolve) => setTimeout(resolve, 1000));
          
      //     // Filter posts by userId
      //     const userPosts = get().posts.filter(post => post.userId === userId);
          
      //     set({ userPosts, isLoading: false });
      //   } catch (error) {
      //     set({ 
      //       error: "Không thể tải danh sách bài đăng của bạn. Vui lòng thử lại sau.", 
      //       isLoading: false 
      //     });
      //   }
      // },

      // getPostById: (id) => {
      //   return get().posts.find(post => post.id === id);
      // },

      // createPost: async (postData, userId, userName, userAvatar) => {
      //   set({ isLoading: true, error: null });
      //   try {
      //     // Simulate API call
      //     await new Promise((resolve) => setTimeout(resolve, 1000));
          
      //     const newPost: Post = {
      //       id: Date.now().toString(),
      //       ...postData,
      //       userId,
      //       userName,
      //       userAvatar,
      //       createdAt: new Date().toISOString(),
      //       status: 'active' as PostStatus,
      //       applicants: 0,
      //     };
          
      //     set(state => ({
      //       posts: [newPost, ...state.posts],
      //       isLoading: false,
      //     }));
          
      //     return newPost;
      //   } catch (error) {
      //     set({ 
      //       error: "Không thể tạo bài đăng. Vui lòng thử lại sau.", 
      //       isLoading: false 
      //     });
      //     throw error;
      //   }
      // },

      // updatePost: async (id, postData) => {
      //   set({ isLoading: true, error: null });
      //   try {
      //     // Simulate API call
      //     await new Promise((resolve) => setTimeout(resolve, 1000));
          
      //     set(state => ({
      //       posts: state.posts.map(post => 
      //         post.id === id ? { ...post, ...postData } : post
      //       ),
      //       isLoading: false,
      //     }));
      //   } catch (error) {
      //     set({ 
      //       error: "Không thể cập nhật bài đăng. Vui lòng thử lại sau.", 
      //       isLoading: false 
      //     });
      //     throw error;
      //   }
      // },

      // deletePost: async (id) => {
      //   set({ isLoading: true, error: null });
      //   try {
      //     // Simulate API call
      //     await new Promise((resolve) => setTimeout(resolve, 1000));
          
      //     set(state => ({
      //       posts: state.posts.filter(post => post.id !== id),
      //       isLoading: false,
      //     }));
      //   } catch (error) {
      //     set({ 
      //       error: "Không thể xóa bài đăng. Vui lòng thử lại sau.", 
      //       isLoading: false 
      //     });
      //     throw error;
      //   }
      // },

      // closePost: async (id) => {
      //   set({ isLoading: true, error: null });
      //   try {
      //     // Simulate API call
      //     await new Promise((resolve) => setTimeout(resolve, 1000));
          
      //     set(state => ({
      //       posts: state.posts.map(post => 
      //         post.id === id ? { ...post, status: 'closed' as PostStatus } : post
      //       ),
      //       isLoading: false,
      //     }));
      //   } catch (error) {
      //     set({ 
      //       error: "Không thể đóng bài đăng. Vui lòng thử lại sau.", 
      //       isLoading: false 
      //     });
      //     throw error;
      //   }
      // },
    }),
    {
      name: 'post-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);