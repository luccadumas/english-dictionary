'use client';

import { HeartOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { TimestampedWordEntry } from '@/types/word-list.types';
import { WordListItem } from './word-list-item';
import { Button } from '@/components/ui/button';

interface FavoriteListItemProps {
  entry: TimestampedWordEntry;
  onSelect: (word: string) => void;
  onRemove: (word: string) => void;
  isRemoving?: boolean;
}

export function FavoriteListItem({
  entry,
  onSelect,
  onRemove,
  isRemoving,
}: FavoriteListItemProps) {
  const t = useTranslations('favorites');

  return (
    <WordListItem
      entry={entry}
      onSelect={onSelect}
      ariaLabelPrefix={t('viewFavorite')}
      trailingAction={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(entry.word)}
          disabled={isRemoving}
          aria-label={t('removeWord', { word: entry.word })}
          className="mr-2 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <HeartOff className="h-4 w-4" aria-hidden="true" />
        </Button>
      }
    />
  );
}
