import { API_ENDPOINTS } from "@/constants/apiEndpoints";

import { api } from "@/services/api";
import {
PaginatedResponse,
SingleItemResponse,
Schedule,
ScheduleCreateRequest,
WeeklySchedule,
} from "@/types";

export const scheduleApi = {

    getSchedulesByClass: async (class_id: string, page = 1, limit = 10) => {
        return api.get<PaginatedResponse<Schedule>>(
            `${API_ENDPOINTS.schedulesByClass(class_id)}?page=${page}&limit=${limit}`
        );
    },

    getScheduleById: async (schedule_id: string) => {
        return api.get<SingleItemResponse<Schedule>>(
            API_ENDPOINTS.schedulesById(schedule_id)
        );
    },

    createSchedule: async (data: ScheduleCreateRequest) => {
        return api.post<SingleItemResponse<Schedule>>(
            API_ENDPOINTS.createSchedule,
            data
        );
    },
    createBulkSchedules: async (data: WeeklySchedule) => {
        return api.post<SingleItemResponse<Schedule[]>>(
            API_ENDPOINTS.createBulkSchedules,
            data
        );
    },

    updateSchedule: async (
        schedule_id: string,
        data: Partial<ScheduleCreateRequest>
    ) => {
        return api.put<SingleItemResponse<Schedule>>(
            API_ENDPOINTS.schedulesById(schedule_id),
            data
        );
    },

    deleteSchedule: async (schedule_id: string) => {
        return api.delete<SingleItemResponse<Schedule>>(
            API_ENDPOINTS.deleteSchedule(schedule_id)
        );
    },
};