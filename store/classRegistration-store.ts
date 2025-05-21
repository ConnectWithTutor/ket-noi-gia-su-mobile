import { create } from "zustand";
import { classRegistrationApi } from "@/api/ClassRegistration";
import {
    ClassRegistration,
    ClassRegistrationCreateRequest,
} from "@/types";

interface ClassRegistrationState {
    registrations: ClassRegistration[];
    registration: ClassRegistration | null;
    total: number;
    loading: boolean;
    error: string | null;
    fetchRegistrations: (page?: number, limit?: number) => Promise<void>;
    fetchRegistrationById: (id: string) => Promise<void>;
    fetchRegistrationsByClass: (class_id: string, page?: number, limit?: number) => Promise<void>;
    fetchRegistrationsByStudent: (student_id: string, page?: number, limit?: number) => Promise<void>;
    createRegistration: (data: ClassRegistrationCreateRequest) => Promise<boolean>;
    updateRegistration: (id: string, data: Partial<ClassRegistrationCreateRequest>) => Promise<boolean>;
    deleteRegistration: (id: string) => Promise<boolean>;
    clearError: () => void;
}

export const useClassRegistrationStore = create<ClassRegistrationState>((set, get) => ({
    registrations: [],
    registration: null,
    total: 0,
    loading: false,
    error: null,

    fetchRegistrations: async (page = 1, limit = 10) => {
        set({ loading: true, error: null });
        try {
            const res = await classRegistrationApi.getClassRegistrations(page, limit);
            set({
                registrations: res.data,
                total: res.pagination.totalItems,
                loading: false,
            });
        } catch (e: any) {
            set({
                error: e.message || "Failed to fetch registrations",
                loading: false,
            });
        }
    },

    fetchRegistrationById: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const res = await classRegistrationApi.getClassRegistrationById(id);
            set({
                registration: res.data,
                loading: false,
            });
        } catch (e: any) {
            set({
                error: e.message || "Failed to fetch registration",
                loading: false,
            });
        }
    },

    fetchRegistrationsByClass: async (class_id: string, page = 1, limit = 10) => {
        set({ loading: true, error: null });
        try {
            const res = await classRegistrationApi.getClassRegistrationsByClass(class_id, page, limit);
            set({
                registrations: res.data,
                total: res.pagination.totalItems,
                loading: false,
            });
        } catch (e: any) {
            set({
                error: e.message || "Failed to fetch registrations by class",
                loading: false,
            });
        }
    },

    fetchRegistrationsByStudent: async (student_id: string, page = 1, limit = 10) => {
        set({ loading: true, error: null });
        try {
            const res = await classRegistrationApi.getClassRegistrationsByStudent(student_id, page, limit);
            set({
                registrations: res.data,
                total: res.pagination.totalItems,
                loading: false,
            });
        } catch (e: any) {
            set({
                error: e.message || "Failed to fetch registrations by student",
                loading: false,
            });
        }
    },
    createRegistration: async (data: ClassRegistrationCreateRequest) => {
        set({ loading: true, error: null });
        try {
            const res = await classRegistrationApi.createClassRegistration(data);
            set(state => ({
                total: state.total + 1,
                loading: false,
            }));
            return true;
        } catch (e: any) {
            set({
                error: e.message || "Failed to create registration",
                loading: false,
            });
            return false;
        }
    },

    updateRegistration: async (id: string, data: Partial<ClassRegistrationCreateRequest>) => {
        set({ loading: true, error: null });
        try {
            const res = await classRegistrationApi.updateClassRegistration(id, data);
            set(state => ({
                
                loading: false,
            }));
            return true;
        } catch (e: any) {
            set({
                error: e.message || "Failed to update registration",
                loading: false,
            });
            return false;
        }
    },

    deleteRegistration: async (id: string) => {
        set({ loading: true, error: null });
        try {
            await classRegistrationApi.deleteClassRegistration(id);
            set(state => ({
                total: state.total - 1,

                loading: false,
            }));
            return true;
        } catch (e: any) {
            set({
                error: e.message || "Failed to delete registration",
                loading: false,
            });
            return false;
        }
    },

    clearError: () => set({ error: null }),
}));