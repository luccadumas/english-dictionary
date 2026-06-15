'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { usePathname } from '@/i18n/navigation';
import type { AppRoute } from '@/lib/query/prefetch-routes';

type NavigationPendingContextValue = {
  pendingRoute: AppRoute | null;
  startNavigation: (route: AppRoute) => void;
  isNavigating: boolean;
  isRouteActive: (route: AppRoute) => boolean;
};

const NavigationPendingContext =
  createContext<NavigationPendingContextValue | null>(null);

export function NavigationPendingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [pendingRoute, setPendingRoute] = useState<AppRoute | null>(null);

  useEffect(() => {
    setPendingRoute(null);
  }, [pathname]);

  const startNavigation = useCallback((route: AppRoute) => {
    setPendingRoute(route);
  }, []);

  const isNavigating =
    pendingRoute !== null && pendingRoute !== pathname;

  const isRouteActive = useCallback(
    (route: AppRoute) => {
      if (pendingRoute !== null) {
        return pendingRoute === route;
      }
      return pathname === route;
    },
    [pathname, pendingRoute],
  );

  const value = useMemo(
    () => ({ pendingRoute, startNavigation, isNavigating, isRouteActive }),
    [pendingRoute, startNavigation, isNavigating, isRouteActive],
  );

  return (
    <NavigationPendingContext.Provider value={value}>
      {children}
    </NavigationPendingContext.Provider>
  );
}

export function useNavigationPending(): NavigationPendingContextValue {
  const context = useContext(NavigationPendingContext);
  if (!context) {
    throw new Error(
      'useNavigationPending must be used within NavigationPendingProvider',
    );
  }
  return context;
}

export function useIsNavActive(route: AppRoute): boolean {
  const { isRouteActive } = useNavigationPending();
  return isRouteActive(route);
}
