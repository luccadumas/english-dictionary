import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

type AppLogoProps = {
  variant?: 'default' | 'inverse';
  className?: string;
  showWordmark?: boolean;
};

export function AppLogo({
  variant = 'default',
  className,
  showWordmark = true,
}: AppLogoProps) {
  const isInverse = variant === 'inverse';

  return (
    <div
      className={cn('flex items-center gap-2.5', className)}
      role="img"
      aria-label="Dictionary"
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm',
          isInverse ? 'bg-white/15' : 'bg-brand',
        )}
      >
        <BookOpen
          className={cn(
            'h-4 w-4',
            isInverse ? 'text-brand' : 'text-brand-foreground',
          )}
          aria-hidden="true"
        />
      </div>
      {showWordmark && (
        <span
          className={cn(
            'text-base font-semibold tracking-tight',
            isInverse ? 'text-white' : 'text-foreground',
          )}
        >
          Dictionary
        </span>
      )}
    </div>
  );
}
