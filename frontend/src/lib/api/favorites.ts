import { apiClient } from './client';
import type { FavoriteEntry } from '@/types/favorites.types';
import type { CursorPaginatedResult, CursorPaginationParams } from '@/types/pagination.types';

export const favoritesApi = {
  getFavorites: async (
    params?: CursorPaginationParams,
  ): Promise<CursorPaginatedResult<FavoriteEntry>> => {
    const res = await apiClient.get<CursorPaginatedResult<FavoriteEntry>>(
      '/user/me/favorites',
      { params },
    );
    return res.data;
  },
};
