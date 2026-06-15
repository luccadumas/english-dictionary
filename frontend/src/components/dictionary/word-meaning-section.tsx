'use client';

import { useTranslations } from 'next-intl';
import type { Meaning } from '@/types/dictionary.types';
import { Separator } from '@/components/ui/separator';
import { WordDefinitionList } from './word-definition-list';
import { WordRelatedTerms } from './word-related-terms';

interface WordMeaningSectionProps {
  meaning: Meaning;
  index: number;
  maxDefinitions?: number;
}

export function WordMeaningSection({
  meaning,
  index,
  maxDefinitions,
}: WordMeaningSectionProps) {
  const t = useTranslations('dictionary');
  const titleId = `meaning-${index}-title`;

  return (
    <section aria-labelledby={titleId} className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 id={titleId} className="text-base font-semibold italic text-foreground">
          {meaning.partOfSpeech}
        </h2>
        <Separator className="flex-1" decorative />
      </div>

      <WordDefinitionList
        definitions={meaning.definitions}
        maxItems={maxDefinitions}
        partOfSpeech={meaning.partOfSpeech}
      />

      <WordRelatedTerms
        label={t('synonymsLabel')}
        terms={meaning.synonyms}
        variant="synonym"
      />
      <WordRelatedTerms
        label={t('antonymsLabel')}
        terms={meaning.antonyms}
        variant="antonym"
      />
    </section>
  );
}
