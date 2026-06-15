'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from '@/i18n/navigation';
import { authApi } from '@/lib/api/auth';
import {
  SESSION_KEY,
  useHasToken,
} from '@/lib/hooks/auth/use-has-token';
import type { User } from '@/types/auth.types';

export const AUTH_KEYS = {
  me: ['auth', 'me'] as const,
  signIn: ['auth', 'sign-in'] as const,
  signUp: ['auth', 'sign-up'] as const,
};

type AuthContextValue = {
  user: User | null | undefined;
  loading: boolean;
  isSigningIn: boolean;
  isSigningUp: boolean;
  isRedirecting: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const hasToken = useHasToken();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  const { data: user, isLoading: loading } = useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: authApi.getMe,
    retry: false,
    enabled: hasToken && !isAuthPage,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const handleAuthSuccess = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: SESSION_KEY });
    await queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
    router.push('/');
    router.refresh();
  }, [queryClient, router]);

  const signInMutation = useMutation({
    mutationKey: AUTH_KEYS.signIn,
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.signIn({ email, password }),
    onSuccess: () => handleAuthSuccess(),
  });

  const signUpMutation = useMutation({
    mutationKey: AUTH_KEYS.signUp,
    mutationFn: ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => authApi.signUp({ name, email, password }),
    onSuccess: () => handleAuthSuccess(),
  });

  const signIn = useCallback(
    async (email: string, password: string) => {
      await signInMutation.mutateAsync({ email, password });
    },
    [signInMutation],
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      await signUpMutation.mutateAsync({ name, email, password });
    },
    [signUpMutation],
  );

  const signOut = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    queryClient.clear();
    signInMutation.reset();
    signUpMutation.reset();
    router.push('/login');
    router.refresh();
  }, [queryClient, router, signInMutation, signUpMutation]);

  const isRedirecting =
    isAuthPage && (signInMutation.isSuccess || signUpMutation.isSuccess);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user as User | null | undefined,
      loading: hasToken && !isAuthPage ? loading : false,
      isSigningIn: signInMutation.isPending,
      isSigningUp: signUpMutation.isPending,
      isRedirecting,
      signIn,
      signUp,
      signOut,
    }),
    [
      user,
      hasToken,
      isAuthPage,
      loading,
      signInMutation.isPending,
      signUpMutation.isPending,
      isRedirecting,
      signIn,
      signUp,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
