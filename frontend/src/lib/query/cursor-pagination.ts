import type { CursorPaginatedResult } from '@/types/pagination.types';

export function getCursorNextPageParam<T>(
  lastPage: CursorPaginatedResult<T>,
): string | undefined {
  return lastPage.hasNext ? lastPage.next ?? undefined : undefined;
}
