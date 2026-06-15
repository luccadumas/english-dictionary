'use client';

import { useTranslations } from 'next-intl';
import type { WordEntry } from '@/types/dictionary.types';
import { WordActions } from './word-actions';

interface WordHeaderProps {
  entry: WordEntry;
  headingId?: string;
  onAddFavorite?: () => void;
  onRemoveFavorite?: () => void;
  isFavoriting?: boolean;
}

export function WordHeader({
  entry,
  headingId = 'word-heading',
  onAddFavorite,
  onRemoveFavorite,
  isFavoriting,
}: WordHeaderProps) {
  const t = useTranslations('dictionary');

  return (
    <header className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <h1
          id={headingId}
          className="text-4xl font-bold capitalize text-foreground"
        >
          {entry.word}
        </h1>
        {entry.phonetic && (
          <p
            className="text-lg text-primary"
            aria-label={t('phoneticLabel', { phonetic: entry.phonetic })}
          >
            {entry.phonetic}
          </p>
        )}
      </div>
      <WordActions
        word={entry.word}
        phonetics={entry.phonetics}
        onAddFavorite={onAddFavorite}
        onRemoveFavorite={onRemoveFavorite}
        isFavoriting={isFavoriting}
      />
    </header>
  );
}
