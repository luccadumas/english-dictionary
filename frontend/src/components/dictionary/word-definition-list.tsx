'use client';

import { useTranslations } from 'next-intl';
import type { Definition } from '@/types/dictionary.types';

interface WordDefinitionListProps {
  definitions: Definition[];
  maxItems?: number;
  partOfSpeech: string;
}

export function WordDefinitionList({
  definitions,
  maxItems,
  partOfSpeech,
}: WordDefinitionListProps) {
  const t = useTranslations('dictionary');
  const items = maxItems ? definitions.slice(0, maxItems) : definitions;

  return (
    <ul className="space-y-3" aria-label={t('definitionsFor', { partOfSpeech })}>
      {items.map((def, index) => (
        <li key={index} className="flex gap-3">
          <span
            className="mt-0.5 flex-shrink-0 text-sm text-primary"
            aria-hidden="true"
          >
            •
          </span>
          <div className="space-y-1">
            <p className="text-sm text-foreground">{def.definition}</p>
            {def.example && (
              <blockquote className="text-sm italic text-muted-foreground">
                &ldquo;{def.example}&rdquo;
              </blockquote>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
