import { create } from "zustand";
import { usersApi } from "@/api/user";
import { studentApi  } from "@/api/student"; 
import { tutorApi  } from "@/api/tutor"; 
import { User, UserUpdateRequest,TutorProfile,StudentProfile, StudentProfileUpdateRequest, TutorUpdateRequest } from "@/types";

interface UserProfileState {
    user: User | null;
    profileStudent: StudentProfile | null;
    profileTutor: TutorProfile | null;
    usersMap: { [userId: string]: User };
    loading: boolean;
    error: string | null;
    fetchUserById: (id: string) =>Promise< User | null>;
    getProfileStudentById: (id: string) => Promise<StudentProfile | null>;
    getProfileTutorById: (id: string) => Promise<TutorProfile | null>;
    updateProfileStudent: (id: string, data: StudentProfileUpdateRequest) => Promise<boolean>;
    updateProfileTutor: (id: string, data: TutorUpdateRequest) => Promise<boolean>;
    updateUser: (id: string, data: UserUpdateRequest) => Promise<boolean>;
    clearError: () => void;
}

export const useUserProfileStore = create<UserProfileState>((set) => ({
    user: null,
    usersMap: {},
    profileStudent: null,
    profileTutor: null,
    loading: false,
    error: null,

    fetchUserById: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await usersApi.getUsersById(id);
            if (response) { 
                set(state => ({
                    loading: false,
                    usersMap: { ...state.usersMap, [id]: response },
                    user: response,
                }));
                return response;
            } else {
                set({
                    loading: false,
                    error: "Không thể lấy thông tin người dùng",
                });
                return null;
            }
        } catch (error: any) {
            set({
                loading: false,
                error: error.message || "Không thể lấy thông tin người dùng",
            });
            return null;
        }
    },

    updateUser: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const response = await usersApi.updateProfile(id, data);

            if (response.data) {
                set({ user: response.data, loading: false });
                return true;
            } else {
                set({
                    loading: false,
                    error: response.detail?.msg || "Không thể cập nhật thông tin người dùng",
                });
                return false;
            }
        } catch (error: any) {
            set({
                loading: false,
                error: error.message || "Không thể cập nhật thông tin người dùng",
            });
            return false;
        }
    },

    getProfileStudentById: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await studentApi.studentProfileById(id);
            if (response) {
                set({ loading: false, profileStudent: response });
                return response;
            } else {
                set({
                    loading: false,
                    error: "Không thể lấy thông tin học sinh",
                });
                return null;
            }
        } catch (error: any) {
            set({
                loading: false,
                error: error.message || "Không thể lấy thông tin học sinh",
            });
            return null;
        }
    },
    updateProfileStudent: async (id, data: StudentProfileUpdateRequest) => {
        set({ loading: true, error: null });
        try {
            const response = await studentApi.updateStudentProfiles(id, data);
            
            if (response.data) {
                set(state => ({
                    profileStudent: {
                        userId: id,
                        studentId: state.profileStudent?.studentId || "",
                        gradeLevel: data.gradeLevel ?? state.profileStudent?.gradeLevel ?? "",
                        learningGoals: data.learningGoals ?? state.profileStudent?.learningGoals ?? "",
                        preferredStudyTime: data.preferredStudyTime ?? state.profileStudent?.preferredStudyTime ?? "",
                        description: data.description ?? state.profileStudent?.description ?? ""
                    },
                    loading: false
                }));
                return true;
            } else {
                set({
                    loading: false,
                    error: response.detail?.msg || "Không thể cập nhật thông tin học sinh",
                });
                throw new Error(response.detail?.msg || "Không thể cập nhật thông tin học sinh");
            }
        } catch (error: any) {
            set({
                loading: false,
                error: error || "Không thể cập nhật thông tin học sinh",
            });
            return false;
        }
    },
    getProfileTutorById: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await tutorApi.tutorProfileById(id);
            if (response) {
                set({ loading: false, profileTutor: response });
                return response;
            } else {
                set({
                    loading: false,
                    error: "Không thể lấy thông tin gia sư",
                });
                return null;
            }
        } catch (error: any) {
            set({
                loading: false,
                error: error.message || "Không thể lấy thông tin gia sư",
            });
            return null;
        }
    },
    updateProfileTutor: async (id, data: TutorUpdateRequest) => {
        set({ loading: true, error: null });
        try {
            const response = await tutorApi.updateTutorProfiles(id, data);
            if (response.data) {
                set({ loading: false });
                return true;
            } else {
                set({
                    loading: false,
                    error: response.detail?.msg || "Không thể cập nhật thông tin gia sư",
                });
                throw new Error(response.detail?.msg || "Không thể cập nhật thông tin gia sư");
            }
        } catch (error: any) {
            set({
                loading: false,
                error: error || "Không thể cập nhật thông tin gia sư",
            });
            return false;
        }
    },

    clearError: () => set({ error: null }),
}));