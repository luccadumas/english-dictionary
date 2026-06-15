'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { prefetchRoute, type AppRoute } from '@/lib/query/prefetch-routes';
import { useNavigationPending } from '@/components/providers/navigation-pending-provider';

type NavLinkProps = ComponentProps<'a'> & {
  href: AppRoute;
  prefetchOnHover?: boolean;
};

export function NavLink({
  href,
  prefetchOnHover = true,
  className,
  children,
  onPointerDown,
  onClick,
  ...props
}: NavLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { startNavigation, isRouteActive } = useNavigationPending();
  const isActive = isRouteActive(href);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    isNavigatingRef.current = false;
  }, [pathname]);

  const prefetchData = useCallback(() => {
    if (pathname === href) return;
    void prefetchRoute(queryClient, href);
  }, [queryClient, href, pathname]);

  const navigate = useCallback(() => {
    if (pathname === href || isNavigatingRef.current) return;

    isNavigatingRef.current = true;
    startNavigation(href);
    prefetchData();
    router.push(href);
  }, [pathname, href, startNavigation, prefetchData, router]);

  const handlePointerDown = (event: React.PointerEvent<HTMLAnchorElement>) => {
    onPointerDown?.(event);
    if (event.defaultPrevented || event.button !== 0) return;
    navigate();
  };

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    event.preventDefault();

    // Mouse/touch: pointerdown already navigated.
    if (isNavigatingRef.current) return;

    // Keyboard (Enter/Space): no pointerdown, navigate here.
    if (pathname !== href) {
      navigate();
    }
  };

  const handlePrefetch = useCallback(() => {
    if (!prefetchOnHover || pathname === href) return;
    prefetchData();
  }, [prefetchOnHover, pathname, href, prefetchData]);

  return (
    <a
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(className, isActive && 'nav-link-active')}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
      {...props}
    >
      {children}
    </a>
  );
}
