import { Address, AddressCreateRequest, PaginatedResponse, SingleItemResponse } from "@/types";
import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';
import { addressApi } from "@/api/address";
interface AddressState {
  Address: Address | null;
  isLoading: boolean;
  error: string | null;
}
interface AddressStoreState extends AddressState {
    fetchAddressById: (id: string) => Promise<Address | null>;
    createAddress: (data: AddressCreateRequest) => Promise<boolean>;
    // updateAddress: (id: string, data: Partial<Address>) => Promise<boolean>;
    // deleteAddress: (id: string) => Promise<boolean>;
    // setSelectedAddress: (address: Address | null) => void;
    clearError: () => void;
}

export const useAddressStore = create<AddressStoreState>()(
        (set, get) => ({
            Address: null,
            isLoading: false,
            error: null,

           

            fetchAddressById: async (id: string) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await addressApi.getAddressById(id);
                    const address = (res as SingleItemResponse<Address>).data || null;
                    set({ Address: address, isLoading: false });
                    return address;
                } catch (e: any) {
                    set({
                        error: e.message || "Không thể tải địa chỉ. Vui lòng thử lại sau.",
                        isLoading: false,
                    });
                    return null;
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
            clearError: () => set({ error: null }),
}));


            

        //     updateAddress: async (id: string, data: Partial<Address>) => {
        //         set({ isLoading: true, error: null });
        //         try {
        //             const res = await addressApi.updateAddress(id, data);
        //             const updated = (res as SingleItemResponse<Address>).data;
        //             if (updated) {
        //                 set((state) => ({
        //                     addresses: state.addresses.map((a) =>
        //                         a.id === id ? updated : a
        //                     ),
        //                     selectedAddress:
        //                         state.selectedAddress?.id === id
        //                             ? updated
        //                             : state.selectedAddress,
        //                     isLoading: false,
        //                 }));
        //                 return true;
        //             }
        //             set({
        //                 error: "Không thể cập nhật địa chỉ. Vui lòng thử lại sau.",
        //                 isLoading: false,
        //             });
        //             return false;
        //         } catch (e: any) {
        //             set({
        //                 error: e.message || "Không thể cập nhật địa chỉ. Vui lòng thử lại sau.",
        //                 isLoading: false,
        //             });
        //             return false;
        //         }
        //     },

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