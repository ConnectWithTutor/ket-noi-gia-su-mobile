import { create } from "zustand";
import { paymentApi } from "@/api/payment";
import { PaymentDetails, PaymentMethod, PaymentOrder, PaymentOrderResponse } from "@/types";


interface PaymentState {
    payments: PaymentDetails[];
    methods: PaymentMethod[];
    loading: boolean;
    error: string | null;
    fetchPayments: (userId: string) => Promise<PaymentDetails[]>;
    PaymentOrder: (data: PaymentOrder) => Promise<PaymentOrderResponse | null>;
    fetchPaymentMethods: () => Promise<PaymentMethod[]>;
    clearError: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
    payments: [],
    methods: [],
    loading: false,
    error: null,

    fetchPayments: async (userId) => {
        set({ loading: true, error: null });
        try {
            const response = await paymentApi.getPaymentsByUserId(userId);
            if (response) {
                set({ payments: response.data, loading: false });
                return response.data;
            } else {
                set({
                    loading: false,
                    error: "Không thể lấy danh sách thanh toán",
                });
                return [];
            }
        } catch (error: any) {
            set({
                loading: false,
                error: error.message || "Không thể lấy danh sách thanh toán",
            });
            return [];
        }
    },

    PaymentOrder: async (data: PaymentOrder) => {
        set({ loading: true, error: null });
        try {
            const response = await paymentApi.PaymentOrder(data);
            if (response) {
                set(() => ({
                    loading: false,
                }));
                return response as PaymentOrderResponse;
            } else {
                set({
                    loading: false,
                    error:  "Không thể tạo thanh toán",
                });
                return null;
            }
        } catch (error: any) {
            set({
                loading: false,
                error: error.message || "Không thể tạo thanh toán",
            });
            return null;
        }
    },
    fetchPaymentMethods: async () => {
        set({ loading: true, error: null });
        try {
            const response = await paymentApi.PaymentMethod();
            if (response) {
                set({ methods: response.data, loading: false });
                return response.data;
            } else {
                set({
                    loading: false,
                    error: "Không thể lấy phương thức thanh toán",
                });
                return [];
            }
        } catch (error: any) {
            set({
                loading: false,
                error: error.message || "Không thể tạo thanh toán",
            });
            return [];
        }
    },
    

    clearError: () => set({ error: null }),
}));