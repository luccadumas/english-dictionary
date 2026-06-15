export interface HistoryEntry {
  word: string;
  added: string;
}

export interface HistoryListResult {
  results: HistoryEntry[];
  totalDocs: number;
  previous: string | null;
  next: string | null;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IHistoryRepository {
  addEntry(userId: string, wordId: number): Promise<void>;
  listHistory(params: {
    userId: string;
    limit: number;
    cursor?: string;
  }): Promise<HistoryListResult>;
}

export const HISTORY_REPOSITORY = Symbol('IHistoryRepository');
