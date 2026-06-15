import { apiClient } from './client';
import type { HistoryEntry } from '@/types/history.types';
import type { CursorPaginatedResult, CursorPaginationParams } from '@/types/pagination.types';

function normalizeHistoryEntry(entry: HistoryEntry): HistoryEntry {
  return {
    word: entry.word,
    added:
      typeof entry.added === 'string'
        ? entry.added
        : new Date(entry.added as unknown as string).toISOString(),
  };
}

export const historyApi = {
  getHistory: async (
    params?: CursorPaginationParams,
  ): Promise<CursorPaginatedResult<HistoryEntry>> => {
    const res = await apiClient.get<CursorPaginatedResult<HistoryEntry>>(
      '/user/me/history',
      { params },
    );

    return {
      ...res.data,
      results: res.data.results.map(normalizeHistoryEntry),
    };
  },
};
