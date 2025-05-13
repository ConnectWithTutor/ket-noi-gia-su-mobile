




export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    roleId: string; 
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordChangeRequest {
    oldPassword: string;
    newPassword: string;
}
