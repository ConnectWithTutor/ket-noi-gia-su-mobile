import { create } from "zustand";
import {  StatusApi } from "@/api/status";
import { Status } from "@/types";
interface StatusState {
    statusesStudentRequest: Status[];
    StatusesTutorApplication: Status[];
    StatusesClass: Status[];
    StatusesPayment: Status[];
    loading: boolean;
    loaded: boolean;    
    error: string | null;
    fetchStatuses: () => Promise<void>;
    fetchStatusTutorApplication: () => Promise<void>;
    fetchStatusesClass: () => Promise<void>;
    fetchStatusPayment: () => Promise<void>;
    clearError: () => void;
}

export const useStatusStore = create<StatusState>((set,get) => ({
    statusesStudentRequest: [],
StatusesTutorApplication: [],
    StatusesClass: [],
    StatusesPayment: [],
    loading: false,
    loaded: false, 
    error: null,

    fetchStatuses: async () => {
        const { loaded } = get();
        if (loaded) return;
        set({ loading: true, error: null });
        try {
            const response = await StatusApi.getStatusStudentRequest();
            if (response.data) {
                set({
                    statusesStudentRequest: response.data,
                    loading: false,
                     loaded: false,
                });
            } else {
                set({
                    loading: false,
                    error: "Failed to fetch statuses",
                });
            }
        } catch (error: any) {
            set({
                loading: false,
                error: error.message || "Failed to fetch statuses",
            });
        }
    },
    fetchStatusTutorApplication: async () => {
        const { loaded } = get();
        if (loaded) return;
        set({ loading: true, error: null });
        try {
            const response = await StatusApi.getStatusTutorApplication(1,20);
            if (response.data) {
               
                set({
                    StatusesTutorApplication: response.data,
                    loading: false,
                     loaded: false,
                });
            } else {
                set({
                    loading: false,
                    error: "Failed to fetch statuses",
                });
            }
        }
        catch (error: any) {
            set({
                loading: false,
                error: error.message || "Failed to fetch statuses",
            });
        }
    }
    ,
    fetchStatusesClass: async () => {
        const { loaded } = get();
        if (loaded) return;
        set({ loading: true, error: null });
        try {
            const response = await StatusApi.getStatusClass(1,20);
            if (response.data) {
                set({
                    StatusesClass: response.data,
                    loading: false,
                     loaded: false,
                });
            } else {
                set({
                    loading: false,
                    error: "Failed to fetch statuses",
                });
            }
        } catch (error: any) {
            set({
                loading: false,
                error: error.message || "Failed to fetch statuses",
            });
        }
    },
    fetchStatusPayment: async () => {
        set({ loading: true, error: null });
        try {
            const response = await StatusApi.getStatusPayment();
            if (response.data) {
                set({
                    loading: false,
                    loaded: true,
                    StatusesPayment: response.data,
                });
            } else {
                set({
                    loading: false,
                    loaded: false,
                    StatusesPayment: [],
                    error: "Failed to fetch payment statuses",
                });
            }
        } catch (error: any) {
            set({
                loading: false,
                loaded: false,
                StatusesPayment: [],
                error: error.message || "Failed to fetch payment statuses",
            });
        }
    },
    clearError: () => set({ error: null }),
}));
