import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { QueryClient } from '@tanstack/react-query';
import { pollFavoriteStatus } from '@/lib/query/poll-favorite-status';
import { DICTIONARY_KEYS } from '@/lib/hooks/dictionary/use-dictionary';

describe('pollFavoriteStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('stops polling once the expected status is reached', async () => {
    const queryClient = {
      refetchQueries: vi.fn().mockResolvedValue(undefined),
      getQueryData: vi
        .fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true),
    } as unknown as QueryClient;

    const promise = pollFavoriteStatus(queryClient, 'fire', true, {
      intervalMs: 100,
    });

    await vi.runAllTimersAsync();
    await promise;

    expect(queryClient.refetchQueries).toHaveBeenCalledTimes(2);
    expect(queryClient.refetchQueries).toHaveBeenCalledWith({
      queryKey: DICTIONARY_KEYS.isFavorite('fire'),
    });
  });
});
