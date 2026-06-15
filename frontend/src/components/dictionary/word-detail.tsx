'use client';

import type { WordEntry } from '@/types/dictionary.types';
import { WordHeader } from './word-header';
import { WordMeaningSection } from './word-meaning-section';

interface WordDetailProps {
  entry: WordEntry;
  headingId?: string;
  onAddFavorite?: () => void;
  onRemoveFavorite?: () => void;
  isFavoriting?: boolean;
  maxDefinitions?: number;
  showHeader?: boolean;
}

export function WordDetail({
  entry,
  headingId = 'word-heading',
  onAddFavorite,
  onRemoveFavorite,
  isFavoriting,
  maxDefinitions,
  showHeader = true,
}: WordDetailProps) {
  return (
    <div className="space-y-8">
      {showHeader && (
        <WordHeader
          entry={entry}
          headingId={headingId}
          onAddFavorite={onAddFavorite}
          onRemoveFavorite={onRemoveFavorite}
          isFavoriting={isFavoriting}
        />
      )}

      {entry.meanings.map((meaning, index) => (
        <WordMeaningSection
          key={index}
          meaning={meaning}
          index={index}
          maxDefinitions={maxDefinitions}
        />
      ))}
    </div>
  );
}
