import type { QueryClient } from '@tanstack/react-query';
import { DICTIONARY_KEYS } from '@/lib/hooks/dictionary/use-dictionary';

type PollOptions = {
  maxAttempts?: number;
  intervalMs?: number;
};

export async function pollFavoriteStatus(
  queryClient: QueryClient,
  word: string,
  expected: boolean,
  options?: PollOptions,
): Promise<void> {
  const maxAttempts = options?.maxAttempts ?? 8;
  const intervalMs = options?.intervalMs ?? 300;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await queryClient.refetchQueries({
      queryKey: DICTIONARY_KEYS.isFavorite(word),
    });

    const current = queryClient.getQueryData<boolean>(
      DICTIONARY_KEYS.isFavorite(word),
    );
    if (current === expected) return;

    await new Promise((resolve) =>
      setTimeout(resolve, intervalMs * (attempt + 1)),
    );
  }
}
