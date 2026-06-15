'use client';

import { Heart, History, Home, Menu, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/shared/app-logo';
import { NavLink } from '@/components/layout/nav-link';
import { useIsNavActive } from '@/components/providers/navigation-pending-provider';
import type { AppRoute } from '@/lib/query/prefetch-routes';

const NAV_ITEMS: {
  href: AppRoute;
  key: 'home' | 'dictionary' | 'history' | 'favorites';
  icon: typeof Home;
}[] = [
  { href: '/', key: 'home', icon: Home },
  { href: '/dictionary', key: 'dictionary', icon: Search },
  { href: '/history', key: 'history', icon: History },
  { href: '/favorites', key: 'favorites', icon: Heart },
];

function MobileNavItem({
  item,
  label,
  onNavigate,
}: {
  item: (typeof NAV_ITEMS)[number];
  label: string;
  onNavigate: () => void;
}) {
  const isActive = useIsNavActive(item.href);
  const Icon = item.icon;

  return (
    <NavLink
      href={item.href}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
        isActive
          ? 'bg-nav-active text-nav-active-foreground'
          : 'text-muted-foreground hover:bg-accent',
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </NavLink>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations('navigation');

  return (
    <div className="md:hidden">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-10 w-10 rounded-xl p-0"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={t('mainNav')}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <nav
            className="fixed left-4 right-4 top-[4.5rem] z-50 rounded-2xl border border-border bg-card p-2 shadow-elevated"
            aria-label={t('mainNav')}
          >
            <div className="mb-2 border-b border-border px-3 py-2">
              <AppLogo className="h-6" showWordmark={false} />
            </div>
            {NAV_ITEMS.map((item) => (
              <MobileNavItem
                key={item.href}
                item={item}
                label={t(item.key)}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </nav>
        </>
      )}
    </div>
  );
}
