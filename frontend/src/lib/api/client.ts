import axios from 'axios';
import { clearTokenCookie, getTokenFromCookie } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
  validateStatus: (status) => status >= 200 && status < 300 || status === 202,
});

apiClient.interceptors.request.use((config) => {
  const token = getTokenFromCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401 && typeof window !== 'undefined') {
        clearTokenCookie();
        window.location.href = '/login';
      }
      const message =
        error.response?.data?.message ?? error.message ?? 'Unknown error';
      throw new Error(message);
    }
    throw error;
  },
);
