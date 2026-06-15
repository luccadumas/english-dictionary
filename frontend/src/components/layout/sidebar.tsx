'use client';

import { Heart, History, Home, LogOut, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/auth/use-auth';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/shared/app-logo';
import { NavLink } from '@/components/layout/nav-link';
import { UserAvatar } from '@/components/layout/user-avatar';
import { UserProfileModal } from '@/components/layout/user-profile-modal';
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

function SidebarNavItem({
  item,
  label,
}: {
  item: (typeof NAV_ITEMS)[number];
  label: string;
}) {
  const isActive = useIsNavActive(item.href);
  const Icon = item.icon;

  return (
    <NavLink
      href={item.href}
      className={cn(
        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isActive
          ? 'bg-nav-active text-nav-active-foreground shadow-md shadow-brand/25'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      )}
    >
      <Icon
        className={cn(
          'h-4 w-4 shrink-0 transition-transform group-hover:scale-105',
          isActive && 'text-white',
        )}
        aria-hidden="true"
      />
      {label}
    </NavLink>
  );
}

export function Sidebar() {
  const { user, signOut } = useAuth();
  const t = useTranslations('navigation');
  const tCommon = useTranslations('common');
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <aside
      className="hidden w-[260px] shrink-0 flex-col border-r border-border/80 bg-[hsl(var(--sidebar))] md:flex"
      aria-label={t('sidebar')}
    >
      <div className="p-5">
        <NavLink
          href="/"
          className="flex flex-col gap-2 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <AppLogo />
          <p className="text-[11px] font-medium text-muted-foreground">
            {tCommon('appSubtitle')}
          </p>
        </NavLink>
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label={t('mainNav')}>
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem key={item.href} item={item} label={t(item.key)} />
        ))}
      </nav>

      <div className="border-t border-border/80 p-4">
        {user && (
          <>
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="mb-3 flex w-full items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-3 text-left transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-card/40"
              aria-label={t('viewProfile')}
            >
              <UserAvatar name={user.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </button>
            <UserProfileModal
              user={user}
              open={profileOpen}
              onOpenChange={setProfileOpen}
            />
          </>
        )}
        <Button
          type="button"
          variant="ghost"
          onClick={signOut}
          className="h-10 w-full justify-start gap-3 rounded-xl px-3 text-muted-foreground hover:text-destructive"
          aria-label={t('signOut')}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          {tCommon('logout')}
        </Button>
      </div>
    </aside>
  );
}
