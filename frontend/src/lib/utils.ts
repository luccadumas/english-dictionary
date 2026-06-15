import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, locale = 'en'): string {
  const intlLocale =
    locale === 'pt-BR' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US';

  return new Date(dateString).toLocaleDateString(intlLocale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

