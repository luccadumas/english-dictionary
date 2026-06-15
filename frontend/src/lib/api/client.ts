import axios from 'axios';

const API_BASE_URL =
  typeof window !== 'undefined'
    ? '/api/backend'
    : (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
  withCredentials: true,
  validateStatus: (status) =>
    (status >= 200 && status < 300) || status === 202,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401 && typeof window !== 'undefined') {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        window.location.href = '/login';
      }
      const message =
        error.response?.data?.message ?? error.message ?? 'Unknown error';
      throw new Error(message);
    }
    throw error;
  },
);
