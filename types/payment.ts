

export interface PaymentDetails {
  paymentId: string;
  registrationId: string;
  amount: string;
  paidAt: string;
  methodId: string;
  status: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  message?: string;
  errorCode?: string;
}
export interface PaymentOrder {
  paymentId: string;
  methodId: string;
 }
 export interface PaymentOrderResponse {
  message: string;
  id: string;
  redirect_url: string;
}
 export interface PaymentReturn {
  status: string;
  message: string;
  vnp_ResponseCode: string;
  payment_id: string;
  vnp_OrderInfo: string;
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_PayDate: string;
}

export interface PaymentMethod {
  methodId: string;
  methodName: string;
  description: string;
  isActive: boolean;
  logoUrl: string;
  logoPublicId: string;
}