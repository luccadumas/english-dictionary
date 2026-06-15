import { apiClient } from './client';
import type { SignInPayload, SignUpPayload, User } from '@/types/auth.types';

async function parseAuthError(response: Response): Promise<never> {
  const data = await response.json().catch(() => ({}));
  const message =
    typeof data.message === 'string'
      ? data.message
      : Array.isArray(data.message)
        ? data.message.join(', ')
        : 'Authentication failed';
  throw new Error(message);
}

export const authApi = {
  signUp: async (data: SignUpPayload): Promise<void> => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!res.ok) await parseAuthError(res);
  },

  signIn: async (data: SignInPayload): Promise<void> => {
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!res.ok) await parseAuthError(res);
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<User>('/user/me');
    return res.data;
  },
};
