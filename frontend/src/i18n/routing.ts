import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'pt-BR', 'es'],
  defaultLocale: 'en',
  localePrefix: 'never',
  localeDetection: true,
  localeCookie: {
    name: 'app_locale',
    maxAge: 60 * 60 * 24 * 365,
  },
});

export type AppLocale = (typeof routing.locales)[number];

export const LOCALE_FLAGS: Record<AppLocale, string> = {
  en: '🇺🇸',
  'pt-BR': '🇧🇷',
  es: '🇪🇸',
};

export function asAppLocale(locale: string): AppLocale {
  if (routing.locales.includes(locale as AppLocale)) {
    return locale as AppLocale;
  }
  return routing.defaultLocale;
}
