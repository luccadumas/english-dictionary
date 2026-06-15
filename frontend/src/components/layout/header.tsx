'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { MobileNav } from '@/components/layout/mobile-nav';

export function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('theme');

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <header className="glass-panel sticky top-0 z-20 flex h-16 items-center justify-between gap-4 px-4 md:px-8">
      <MobileNav />

      <div className="hidden flex-1 md:block" />

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          aria-label={mounted ? (isDark ? t('switchToLight') : t('switchToDark')) : t('toggle')}
          aria-pressed={mounted ? isDark : undefined}
          className="h-10 w-10 rounded-xl p-0"
        >
          {!mounted ? (
            <span className="h-4 w-4" aria-hidden="true" />
          ) : isDark ? (
            <Sun className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>
    </header>
  );
}
