'use client';

import { Heart, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { WordEntry } from '@/types/dictionary.types';
import { WordActions } from './word-actions';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface WordModalHeaderProps {
  word: string;
  entry?: WordEntry;
  isFavorite?: boolean;
  isFavoriteLoading?: boolean;
  onAddFavorite: () => void;
  onRemoveFavorite: () => void;
  isFavoriting?: boolean;
  onClose: () => void;
}

export function WordModalHeader({
  word,
  entry,
  isFavorite,
  isFavoriteLoading,
  onAddFavorite,
  onRemoveFavorite,
  isFavoriting,
  onClose,
}: WordModalHeaderProps) {
  const t = useTranslations('dictionary');

  return (
    <>
      <DialogHeader className="flex-row items-center justify-between space-y-0">
        <div className="flex min-w-0 items-center gap-3">
          <DialogTitle className="truncate">{word}</DialogTitle>
          {entry?.phonetic && (
            <span className="shrink-0 text-sm text-muted-foreground">
              {entry.phonetic}
            </span>
          )}
          {entry && (
            <WordActions word={word} phonetics={entry.phonetics} size="sm" />
          )}
        </div>
        <div
          className="flex shrink-0 items-center gap-1"
          role="group"
          aria-label={t('modalActions')}
        >
          {!isFavoriteLoading &&
            entry &&
            (isFavorite ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemoveFavorite}
                disabled={isFavoriting}
                aria-label={t('removeFavorite', { word })}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Heart className="h-4 w-4 fill-current" aria-hidden="true" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onAddFavorite}
                disabled={isFavoriting}
                aria-label={t('addFavorite', { word })}
                className="h-8 w-8 p-0"
              >
                <Heart className="h-4 w-4" aria-hidden="true" />
              </Button>
            ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label={t('closeDialog')}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </DialogHeader>
      <DialogDescription id="word-modal-desc" className="sr-only">
        {t('wordDialogDescription', { word })}
      </DialogDescription>
    </>
  );
}
