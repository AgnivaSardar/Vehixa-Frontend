import { apiClient } from '../utils/apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export const usersService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/users/login', credentials);
  },

  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/users/register', data);
  },

  getProfile: async (): Promise<User> => {
    return apiClient.get<User>('/users/profile');
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    return apiClient.put<User>('/users/profile', data);
  },

  logout: async (): Promise<void> => {
    return apiClient.post<void>('/users/logout');
  },

  // OTP-based authentication
  sendLoginOTP: async (email: string): Promise<{ message: string; userExists: boolean }> => {
    return apiClient.post<{ message: string; userExists: boolean }>('/users/otp/send', { email });
  },

  verifyLoginOTP: async (
    email: string,
    otp: string,
    userData?: { name: string; phone?: string }
  ): Promise<{
    user: any;
    token: string;
    isNewUser: boolean;
    message: string;
    success: boolean;
  }> => {
    return apiClient.post('/users/otp/verify', {
      email,
      otp,
      name: userData?.name,
      phone: userData?.phone,
    });
  },
};
