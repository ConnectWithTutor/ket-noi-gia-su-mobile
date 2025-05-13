import { create } from "zustand";
import {  StatusApi } from "@/api/status";
import { Status } from "@/types";
interface StatusState {
    statusesStudentRequest: Status[];
    StatusesTutorApplication: Status[];
    loading: boolean;
    loaded: boolean;    
    error: string | null;
    fetchStatuses: () => Promise<void>;
    fetchStatusTutorApplication: () => Promise<void>;
    clearError: () => void;
}

export const useStatusStore = create<StatusState>((set,get) => ({
    statusesStudentRequest: [],
StatusesTutorApplication: [],
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

    clearError: () => set({ error: null }),
}));
