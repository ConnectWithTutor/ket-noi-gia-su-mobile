import { create } from 'zustand';
import { ZoomMeeting } from '@/types';
import { zoomApi } from '@/api/zoom';


interface ZoomState {
  zoom: ZoomMeeting | null;
  isLoading: boolean;
  error: string | null;
}

interface zoomStore extends ZoomState {
  
  createZoomMeeting: (id: string) => Promise<ZoomMeeting | undefined>;
}

export const useZoomStore = create<zoomStore>((set, get) => ({
      zoom: null,
      isLoading: false,
      error: null,
      createZoomMeeting: async (id) => {
        try {
          const respon = await zoomApi.createZoomMeeting(id);
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
      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
        setZoom: (zoom: ZoomMeeting | null) => set({ zoom }),
        clearZoom: () => set({ zoom: null }),
}));
  
      
    
