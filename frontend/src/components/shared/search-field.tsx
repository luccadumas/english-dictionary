'use client';

import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface SearchFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  submitLabel?: string;
  className?: string;
  size?: 'default' | 'lg';
  isLoading?: boolean;
  loadingLabel?: string;
}

export function SearchField({
  id,
  label,
  value,
  onChange,
  onSubmit,
  placeholder = '',
  submitLabel,
  className,
  size = 'default',
  isLoading = false,
  loadingLabel,
}: SearchFieldProps) {
  const isLarge = size === 'lg';
  const showSubmit = submitLabel && onSubmit;
  const rightPadding = isLoading
    ? isLarge
      ? 'pr-12'
      : 'pr-10'
    : showSubmit
      ? isLarge
        ? 'pr-28'
        : 'pr-24'
      : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <Label htmlFor={id} className="sr-only">
        {label}
      </Label>
      <Search
        className={cn(
          'pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground',
          isLarge ? 'left-4 h-5 w-5' : 'left-3.5 h-4 w-4',
        )}
        aria-hidden="true"
      />
      <Input
        id={id}
        type="search"
        role="searchbox"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className={cn(
          isLarge ? 'h-14 rounded-2xl pl-12 text-base shadow-card' : 'pl-10',
          rightPadding,
        )}
        aria-busy={isLoading}
      />
      {isLoading && (
        <Loader2
          className={cn(
            'absolute top-1/2 -translate-y-1/2 animate-spin text-muted-foreground motion-reduce:animate-none',
            isLarge ? 'right-4 h-5 w-5' : 'right-3.5 h-4 w-4',
          )}
          aria-hidden="true"
        />
      )}
      {loadingLabel && isLoading && (
        <span className="sr-only" role="status">
          {loadingLabel}
        </span>
      )}
      {showSubmit && (
        <Button
          type="submit"
          size={isLarge ? 'default' : 'sm'}
          className={cn(
            'absolute top-1/2 -translate-y-1/2',
            isLarge ? 'right-2 h-10 rounded-xl' : 'right-1.5',
          )}
        >
          {submitLabel}
        </Button>
      )}
    </form>
  );
}
