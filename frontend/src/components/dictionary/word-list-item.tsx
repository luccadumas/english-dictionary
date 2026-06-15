'use client';

import { useLocale, useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import type { TimestampedWordEntry } from '@/types/word-list.types';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate, cn } from '@/lib/utils';

interface WordListItemProps {
  entry: TimestampedWordEntry;
  onSelect: (word: string) => void;
  ariaLabelPrefix?: string;
  trailingAction?: React.ReactNode;
}

export function WordListItem({
  entry,
  onSelect,
  ariaLabelPrefix,
  trailingAction,
}: WordListItemProps) {
  const t = useTranslations('dictionary');
  const locale = useLocale();
  const formattedDate = formatDate(entry.added, locale);

  return (
    <li>
      <Card className="transition-colors hover:border-primary/50">
        <div className={cn('flex items-center', trailingAction && 'gap-0')}>
          <button
            type="button"
            onClick={() => onSelect(entry.word)}
            className="flex min-w-0 flex-1 items-center justify-between rounded-lg px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={
              ariaLabelPrefix
                ? `${ariaLabelPrefix} ${entry.word}, ${formattedDate}`
                : t('viewWord', { word: entry.word, date: formattedDate })
            }
          >
            <CardContent className="flex flex-1 items-center justify-between p-0">
              <div>
                <p className="font-medium capitalize text-foreground">{entry.word}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{formattedDate}</p>
              </div>
              {!trailingAction && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              )}
            </CardContent>
          </button>
          {trailingAction}
        </div>
      </Card>
    </li>
  );
}
