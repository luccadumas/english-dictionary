import { cn } from '@/lib/utils';

const SIZE_CLASSES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-16 w-16 text-2xl',
} as const;

interface UserAvatarProps {
  name: string;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}

export function UserAvatar({ name, size = 'md', className }: UserAvatarProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-primary/20 font-bold text-primary-foreground dark:bg-primary/45 dark:text-primary dark:ring-1 dark:ring-primary/30',
        SIZE_CLASSES[size],
        className,
      )}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}
