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

export const AUTH_TOKEN_COOKIE = 'app_token';

export function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`${AUTH_TOKEN_COOKIE}=([^;]+)`));
  return match ? match[1] : null;
}

export function setTokenCookie(token: string): void {
  const clean = token.replace('Bearer ', '');
  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? '; Secure'
      : '';
  document.cookie = `${AUTH_TOKEN_COOKIE}=${clean}; path=/; max-age=${7 * 24 * 3600}; SameSite=Strict${secure}`;
}

export function clearTokenCookie(): void {
  document.cookie = `${AUTH_TOKEN_COOKIE}=; path=/; max-age=0`;
}
