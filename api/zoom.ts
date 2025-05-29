import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import {   ZoomMeeting } from "@/types";
export const zoomApi = {
  createZoomMeeting: async (schedule_id: string) => {
    return api.post<ZoomMeeting>(
      API_ENDPOINTS.createZoomMeeting(schedule_id),
      {}
    );
  },
 
}
