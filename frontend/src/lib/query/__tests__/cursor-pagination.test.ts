import { describe, expect, it } from 'vitest';
import { getCursorNextPageParam } from '@/lib/query/cursor-pagination';

describe('getCursorNextPageParam', () => {
  it('returns next cursor when hasNext is true', () => {
    const result = getCursorNextPageParam({
      results: ['fire'],
      totalDocs: 10,
      previous: null,
      next: 'cursor-abc',
      hasNext: true,
      hasPrev: false,
    });

    expect(result).toBe('cursor-abc');
  });

  it('returns undefined when hasNext is false', () => {
    const result = getCursorNextPageParam({
      results: ['fire'],
      totalDocs: 1,
      previous: null,
      next: null,
      hasNext: false,
      hasPrev: false,
    });

    expect(result).toBeUndefined();
  });

  it('returns undefined when hasNext is true but next is null', () => {
    const result = getCursorNextPageParam({
      results: ['fire'],
      totalDocs: 10,
      previous: null,
      next: null,
      hasNext: true,
      hasPrev: false,
    });

    expect(result).toBeUndefined();
  });
});
