'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { SkipLink } from '@/components/shared/skip-link';
import { RouteProgress } from '@/components/layout/route-progress';
import { DashboardMain } from '@/components/layout/dashboard-main';
import { NavigationPendingProvider } from '@/components/providers/navigation-pending-provider';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <NavigationPendingProvider>
      <div className="flex h-screen overflow-hidden bg-muted/40 dark:bg-background">
        <RouteProgress />
        <SkipLink />
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main
            id="main-content"
            tabIndex={-1}
            className="app-grid-bg flex-1 overflow-auto focus:outline-none"
          >
            <div className="w-full p-6 pb-10 md:p-8">
              <DashboardMain>{children}</DashboardMain>
            </div>
          </main>
        </div>
      </div>
    </NavigationPendingProvider>
  );
}
