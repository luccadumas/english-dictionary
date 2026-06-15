'use client';

import { Volume2, Heart, HeartOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Phonetic } from '@/types/dictionary.types';
import { playWordAudio } from '@/lib/audio';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WordActionsProps {
  word: string;
  phonetics?: Phonetic[];
  onAddFavorite?: () => void;
  onRemoveFavorite?: () => void;
  isFavoriting?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function WordActions({
  word,
  phonetics = [],
  onAddFavorite,
  onRemoveFavorite,
  isFavoriting,
  size = 'md',
  className,
}: WordActionsProps) {
  const t = useTranslations('dictionary');
  const hasAudio = phonetics.some((p) => p.audio);
  const iconClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const buttonClass =
    size === 'sm' ? 'h-8 w-8 p-0' : 'rounded-full h-10 w-10 p-0';

  if (!hasAudio && !onAddFavorite && !onRemoveFavorite) {
    return null;
  }

  const playAudio = () => {
    const audio = phonetics.find((p) => p.audio)?.audio;
    if (audio) void playWordAudio(audio);
  };

  return (
    <div
      className={cn('flex items-center gap-2', className)}
      role="group"
      aria-label={t('wordActions')}
    >
      {hasAudio && (
        <Button
          type="button"
          variant={size === 'sm' ? 'ghost' : 'default'}
          size="sm"
          onClick={playAudio}
          aria-label={t('playPronunciation', { word })}
          className={buttonClass}
        >
          <Volume2 className={iconClass} aria-hidden="true" />
        </Button>
      )}
      {onAddFavorite && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddFavorite}
          disabled={isFavoriting}
          aria-label={t('addFavorite', { word })}
          className={buttonClass}
        >
          <Heart className={iconClass} aria-hidden="true" />
        </Button>
      )}
      {onRemoveFavorite && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRemoveFavorite}
          disabled={isFavoriting}
          aria-label={t('removeFavorite', { word })}
          className={cn(buttonClass, 'text-destructive hover:text-destructive')}
        >
          <HeartOff className={iconClass} aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
