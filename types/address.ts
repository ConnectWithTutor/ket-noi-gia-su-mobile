export interface Address {
    addressId: string;
    userId?: string;
    classId?: string;
    requestId?: string;
    province: string;
    district: string;
    ward?: string;
    street?: string;
    fullAddres: string;
    latitude: number;
    longitude: number;
}
export interface AddressCreateRequest {
    userId?: string;
    classId?: string;
    requestId?: string;
    province?: string;
    district?: string;
    ward?: string;
    street?: string;
    fullAddress: string;
    latitude?: number;
    longitude?: number;
}