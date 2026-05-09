// lib/withAuthorization.tsx
'use client';

import { ComponentType, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useMeStore, useUser, useSetUser, useClearUser, useSetLoading } from '@stores/useMeStore';
import { routes } from 'routes';
import { useToastMessage } from 'providers/ToastMessageContext';
import i18next from 'i18next';
import { LoadingSpinner } from '@components/atom/AdminloadinSpiner';

interface Options {
  requireAdmin?: boolean;
  requireGuest?: boolean; // For auth routes that should only be accessible when logged out
}

type ExtendedSession = {
  user: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    role?: string;
  };
};

export function withAuthorization<P extends object>(
  WrappedComponent: ComponentType<P>,
  { requireAdmin = false, requireGuest = false }: Options = {},
) {
  return function AuthorizedComponent(props: P) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, status } = useSession() as {
      data: ExtendedSession | null;
      status: 'loading' | 'authenticated' | 'unauthenticated';
    };

    console.log(session);

    const user = useUser();
    const setUser = useSetUser();
    const clearUser = useClearUser();
    const setLoading = useSetLoading();
    const hasHydrated = useMeStore((state) => state._hasHydrated);

    const message = useToastMessage();
    const hasRedirected = useRef(false);

    // Sync session with store
    useEffect(() => {
      if (status === 'loading' || !hasHydrated) {
        setLoading(true);
        return;
      }

      setLoading(false);

      if (status === 'authenticated' && session?.user) {
        const sessionRole = session.user.role?.toLowerCase() as 'student' | 'user' | 'admin';
        const sessionIsAdmin = sessionRole === 'admin';
        if (!user) {
          setUser({
            ...session.user,
            role: sessionRole,
            isAdmin: sessionIsAdmin,
          });
        } else if (user.role?.toLowerCase() !== sessionRole || user.isAdmin !== sessionIsAdmin) {
          // Role changed (e.g. user was promoted to admin) — sync from session
          setUser({ ...user, role: sessionRole, isAdmin: sessionIsAdmin });
        }
      } else if (status === 'unauthenticated') {
        if (user) {
          clearUser();
        }
      }
    }, [status, session?.user, user, setUser, clearUser, setLoading, hasHydrated]);

    // Redirect logic - RESET hasRedirected when auth state changes
    useEffect(() => {
      // Reset redirect flag when auth state changes
      hasRedirected.current = false;
    }, [status, user?.id]); // Reset when status or user identity changes

    useEffect(() => {
      if (status === 'loading' || !hasHydrated || hasRedirected.current) return;

      const isAuthenticated = !!user;
      const isAdmin = user?.role?.toLowerCase() === 'admin' || user?.isAdmin;

      // If requireGuest (auth routes) and user is authenticated, redirect them away
      if (requireGuest && isAuthenticated) {
        hasRedirected.current = true;
        if (isAdmin) {
          router.replace(routes.admin);
        } else {
          router.replace(routes.library);
        }
        return;
      }

      // If requires auth and user is not authenticated, redirect to login
      if (!requireGuest && !isAuthenticated) {
        hasRedirected.current = true;
        router.replace(routes.auth.login);
        return;
      }

      console.log(isAdmin, requireAdmin);
      // If requires admin and user is not admin, redirect to library
      if (requireAdmin && !isAdmin) {
        hasRedirected.current = true;
        message.warning(i18next.t('Not authorized'));
        router.replace(routes.library);
      }
    }, [status, user, router, message, hasHydrated, pathname]);

    // Prevent render until we know the auth state
    if (status === 'loading' || !hasHydrated) return <LoadingSpinner />;

    // For guest-only routes (auth pages)
    if (requireGuest) {
      if (user) return null; // Already authenticated, will redirect
      return <WrappedComponent {...props} />;
    }

    // For protected routes
    if (!user) return null;

    const isAdmin = user.role?.toLowerCase() === 'admin' || user.isAdmin;
    if (requireAdmin && !isAdmin) return null;

    return <WrappedComponent {...props} />;
  };
}
