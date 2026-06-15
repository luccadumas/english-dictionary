export interface CursorPaginatedResult<T> {
  results: T[];
  totalDocs: number;
  previous: string | null;
  next: string | null;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CursorPaginationParams {
  limit?: number;
  cursor?: string;
}
