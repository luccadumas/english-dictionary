'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { TimestampedWordEntry } from '@/types/word-list.types';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

interface WordCardGridItemProps {
  entry: TimestampedWordEntry;
  onSelect: (word: string) => void;
}

export function WordCardGridItem({ entry, onSelect }: WordCardGridItemProps) {
  const t = useTranslations('dictionary');
  const locale = useLocale();
  const formattedDate = formatDate(entry.added, locale);

  return (
    <li>
      <Card className="overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card">
        <button
          type="button"
          onClick={() => onSelect(entry.word)}
          className="w-full rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={t('viewDefinition', { word: entry.word, date: formattedDate })}
        >
          <CardContent className="p-4">
            <p className="text-sm font-semibold capitalize text-foreground">{entry.word}</p>
            <p className="mt-1.5 text-xs text-muted-foreground">{formattedDate}</p>
          </CardContent>
        </button>
      </Card>
    </li>
  );
}
