import { apiClient } from './client';
import type { CursorPaginatedResult } from '@/types/pagination.types';
import type { WordEntry } from '@/types/dictionary.types';

export const dictionaryApi = {
  listWords: async (params: {
    search?: string;
    limit?: number;
    cursor?: string;
  }): Promise<CursorPaginatedResult<string>> => {
    const res = await apiClient.get<CursorPaginatedResult<string>>(
      '/entries/en',
      { params },
    );
    return res.data;
  },

  getWordDetails: async (word: string): Promise<WordEntry[]> => {
    const res = await apiClient.get<WordEntry[]>(`/entries/en/${word}`);
    return res.data;
  },

  isFavorite: async (word: string): Promise<boolean> => {
    const res = await apiClient.get<{ isFavorite: boolean }>(
      `/entries/en/${word}/is-favorite`,
    );
    return res.data.isFavorite;
  },

  addFavorite: async (word: string): Promise<void> => {
    await apiClient.post(`/entries/en/${word}/favorite`);
  },

  removeFavorite: async (word: string): Promise<void> => {
    await apiClient.delete(`/entries/en/${word}/unfavorite`);
  },
};
