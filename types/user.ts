export interface User {
  userId: string;
  username: string;
  fullName: string;
  birthDate: string | null; 
  phoneNumber: string;
  address: string | null;
  email: string;
  avatarUrl: string | null;
  averageRating: number | null;
  roleId: string;
  isVerified: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UserUpdateRequest {
  username?: string;
  fullName?: string;
  birthDate?: string;
  phoneNumber?: string;
  address?: string;
  email?: string;
  avatarUrl?: string;
  isVerified?: boolean;
}