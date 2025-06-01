

    import { api } from "@/services/api";
    import { API_ENDPOINTS } from "@/constants/apiEndpoints";
    import { 
      PaginatedResponse, 
      PaymentDetails,
        PaymentOrder,
        PaymentOrderResponse,
        PaymentReturn,
        PaymentMethod
    } from "@/types";

    
    export const paymentApi = {
        getPaymentsByUserId: async (userId: string) => {
            return api.get<PaginatedResponse<PaymentDetails>>(`${API_ENDPOINTS.paymentsByUser(userId)}`);
        },
        PaymentById: async (payment_registration_id: string) => {
            return api.get<PaymentDetails>(`${API_ENDPOINTS.paymentById(payment_registration_id)}`);
        },
        PaymentOrder: async (data: PaymentOrder) => {
            return api.post<PaymentOrderResponse>(API_ENDPOINTS.paymentOrder, data);
        },
        PaymentMethod: async () => {
            return api.get<PaginatedResponse<PaymentMethod>>(API_ENDPOINTS.paymentMethods);
        }

    }