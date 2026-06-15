'use client';

import {
  useWordDetail,
  useToggleFavorite,
  useIsFavorite,
} from '@/lib/hooks/dictionary/use-dictionary';
import { WordDetailSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { WordDetail } from '@/components/dictionary/word-detail';
import { WordModalHeader } from '@/components/dictionary/word-modal-header';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface WordDetailModalProps {
  word: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WordDetailModal({ word, open, onOpenChange }: WordDetailModalProps) {
  const { data: entries, isLoading, isError, refetch } = useWordDetail(word, {
    enabled: open && !!word,
  });
  const { data: isFavorite, isLoading: isFavoriteLoading } = useIsFavorite(word, {
    enabled: open && !!word,
  });
  const { add, remove } = useToggleFavorite(word);

  const entry = entries?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={entry ? 'word-modal-desc' : undefined}>
        <WordModalHeader
          word={word}
          entry={entry}
          isFavorite={isFavorite}
          isFavoriteLoading={isFavoriteLoading}
          onAddFavorite={() => add.mutate(word)}
          onRemoveFavorite={() => remove.mutate(word)}
          isFavoriting={add.isPending || remove.isPending}
          onClose={() => onOpenChange(false)}
        />

        <div className="flex-1 overflow-y-auto px-6 pb-6" aria-busy={isLoading}>
          {isLoading && <WordDetailSkeleton />}
          {isError && <ErrorState onRetry={refetch} />}
          {entry && (
            <WordDetail entry={entry} showHeader={false} maxDefinitions={5} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
