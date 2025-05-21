import { api } from "@/services/api";
import {SingleItemResponse, PaginatedResponse, Address } from "@/types";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
export const addressApi = {
    getAddresses: async () => {
        return api.get<PaginatedResponse<any>>(
            API_ENDPOINTS.addresses
        );
    },

    getAddressById: async (user_request_class_id: string) => {
        return api.get<SingleItemResponse<any>>(
            API_ENDPOINTS.addressById(user_request_class_id)
        );
    },

    createAddress: async (data: any) => {
        return api.post<SingleItemResponse<any>>(
            API_ENDPOINTS.createAddress,
            data
        );
    },

    updateAddress: async (address_id: string, data: any) => {
        return api.put<SingleItemResponse<any>>(
            API_ENDPOINTS.updateAddress(address_id),
            data
        );
    },

    deleteAddress: async (address_id: string) => {
        return api.delete<SingleItemResponse<any>>(
            API_ENDPOINTS.deleteAddress(address_id)
        );
    },
}