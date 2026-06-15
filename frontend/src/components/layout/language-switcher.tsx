'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { LOCALE_FLAGS, routing, type AppLocale } from '@/i18n/routing';
import { setLocaleCookie } from '@/lib/locale-cookie';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations('language');
  const tNav = useTranslations('navigation');
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();

  const switchLocale = (nextLocale: AppLocale) => {
    if (nextLocale === locale) return;
    setLocaleCookie(nextLocale);
    window.location.href = pathname || '/';
  };

  return (
    <div
      className={cn(
        'flex items-center gap-0.5 rounded-xl border border-border/80 bg-background/60 p-1 shadow-soft',
        className,
      )}
      role="group"
      aria-label={tNav('switchLanguage')}
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          aria-label={t('switch', { language: t(loc) })}
          aria-pressed={locale === loc}
          title={t(loc)}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-all',
            'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            locale === loc
              ? 'bg-brand/10 ring-1 ring-brand/30'
              : 'opacity-75 hover:opacity-100',
          )}
        >
          <span role="img" aria-hidden="true">
            {LOCALE_FLAGS[loc]}
          </span>
        </button>
      ))}
    </div>
  );
}
