'use client';

import { useTranslations } from 'next-intl';
import { WordGridItem } from './word-grid-item';

interface WordGridProps {
  words: string[];
  onWordSelect: (word: string) => void;
}

export function WordGrid({ words, onWordSelect }: WordGridProps) {
  const t = useTranslations('dictionary');

  return (
    <ul
      className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
      aria-label={t('wordList')}
    >
      {words.map((word) => (
        <WordGridItem key={word} word={word} onSelect={onWordSelect} />
      ))}
    </ul>
  );
}
