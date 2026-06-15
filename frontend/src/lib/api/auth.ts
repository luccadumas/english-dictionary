import { apiClient } from './client';
import type { AuthResponse, SignInPayload, SignUpPayload, User } from '@/types/auth.types';

export const authApi = {
  signUp: async (data: SignUpPayload): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/signup', data);
    return res.data;
  },

  signIn: async (data: SignInPayload): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/signin', data);
    return res.data;
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<User>('/user/me');
    return res.data;
  },
};
