'use client';

import { useTranslations } from 'next-intl';

interface WordGridItemProps {
  word: string;
  onSelect: (word: string) => void;
}

export function WordGridItem({ word, onSelect }: WordGridItemProps) {
  const t = useTranslations('dictionary');

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(word)}
        className="w-full truncate rounded-xl border border-border/80 bg-card px-3 py-3 text-left text-sm font-medium text-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={t('openDefinition', { word })}
        aria-haspopup="dialog"
      >
        {word}
      </button>
    </li>
  );
}
