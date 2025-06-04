import { Address, AddressAutoComplete, AddressCreateRequest, PaginatedResponse, SingleItemResponse } from "@/types";
import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';
import { addressApi } from "@/api/address";
interface AddressState {
  Address: Address | null;
addressMap: Record<string, Address>;
  isLoading: boolean;
  error: string | null;
addressAutoComplete: AddressAutoComplete[],

}
interface AddressStoreState extends AddressState {
    fetchAddressById: (id: string) => Promise<Address | null>;
    fetchAddressAutoComplete: (text: string) => Promise<void>;
    createAddress: (data: AddressCreateRequest) => Promise<boolean>;
    updateAddress: (id: string, data: Partial<AddressCreateRequest>) => Promise<boolean>;
    // deleteAddress: (id: string) => Promise<boolean>;
    // setSelectedAddress: (address: Address | null) => void;
    clearError: () => void;
}

export const useAddressStore = create<AddressStoreState>()(
        (set, get) => ({
            Address: null,
            isLoading: false,
            error: null,
            addressMap: {},
            addressAutoComplete: [],

            fetchAddressById: async (id: string) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await addressApi.getAddressById(id);
                    const address = (res as SingleItemResponse<Address>).data || null;
                    set({
                        Address: address,
                        addressMap: address ? { ...get().addressMap, [id]: address } : get().addressMap,
                        isLoading: false
                    });
                    return address;
                } catch (e: any) {
                    set({
                        error: e.message || "Không thể tải địa chỉ. Vui lòng thử lại sau.",
                        isLoading: false,
                    });
                    return null;
                }
            },

            fetchAddressAutoComplete: async (text: string) => {
                
                set({ isLoading: true, error: null });
                try {
                    const encodedQuery = encodeURIComponent(text.trim());
                    const url = `https://nominatim.openstreetma p.org/search?format=json&q=${encodedQuery}&addressdetails=1&limit=3`;
                    const res = await fetch(url, {
                        headers: {
                            'User-Agent': 'KetNoiGiaSuApp/1.0 ',
                            'Accept-Language': 'vi' // có thể chọn 'en' hoặc 'vi'
                        }
                        });
                    if (res) {
                        const data: AddressAutoComplete[] = await res.json();
                        set({
                            addressAutoComplete: data,
                            isLoading: false,
                        });
                    } else {
                        set({
                            error: "Không tìm thấy địa chỉ phù hợp.",
                            isLoading: false,
                        });
                    }
                } catch (e: any) {
                    set({
                        error: e.message || "Không thể tìm kiếm địa chỉ. Vui lòng thử lại sau.",
                        isLoading: false,
                    });
                }
            },
            createAddress: async (data: AddressCreateRequest) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await addressApi.createAddress(data);
                    if (!res.detail) {
                        set((state) => ({
                            isLoading: false,
                        }));
                        return true;
                    }
                    set({
                        error:res.detail.msg || "Không thể tạo địa chỉ. Vui lòng thử lại sau.",
                        isLoading: false,
                    });
                    return false;
                } catch (e: any) {
                    set({
                        error: e.message || "Không thể tạo địa chỉ. Vui lòng thử lại sau.",
                        isLoading: false,
                    });
                    return false;
                }
            },
            updateAddress: async (id: string, data: Partial<AddressCreateRequest>) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await addressApi.updateAddress(id, data);
                    const updated = (res as SingleItemResponse<Address>).data;
                    if (updated) {
                        set((state) => ({
                            Address: updated,
                            isLoading: false,
                        }));
                        return true;
                    }
                    set({
                        error: "Không thể cập nhật địa chỉ. Vui lòng thử lại sau.",
                        isLoading: false,
                    });
                    return false;
                } catch (e: any) {
                    set({
                        error: e.message || "Không thể cập nhật địa chỉ. Vui lòng thử lại sau.",
                        isLoading: false,
                    });
                    return false;
                }
            },
            clearError: () => set({ error: null }),
}));


            

            

        //     deleteAddress: async (id: string) => {
        //         set({ isLoading: true, error: null });
        //         try {
        //             await addressApi.deleteAddress(id);
        //             set((state) => ({
        //                 addresses: state.addresses.filter((a) => a.id !== id),
        //                 selectedAddress:
        //                     state.selectedAddress?.id === id ? null : state.selectedAddress,
        //                 isLoading: false,
        //             }));
        //             return true;
        //         } catch (e: any) {
        //             set({
        //                 error: e.message || "Không thể xóa địa chỉ. Vui lòng thử lại sau.",
        //                 isLoading: false,
        //             });
        //             return false;
        //         }
        //     },

        //     setSelectedAddress: (address: Address | null) => {
        //         set({ selectedAddress: address });
        //     },
        // }),