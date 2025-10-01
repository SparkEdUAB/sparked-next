// lib/withAuthorization.tsx
'use client';

import { ComponentType, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useMeStore, useUser, useSetUser, useClearUser, useSetLoading } from '@stores/useMeStore';
import { routes } from 'routes';
import { useToastMessage } from 'providers/ToastMessageContext';
import i18next from 'i18next';
import { LoadingSpinner } from '@components/atom/AdminloadinSpiner';

interface Options {
  requireAdmin?: boolean;
}

type ExtendedSession = {
  user: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    role: {
      name: 'student' | 'user' | 'admin';
    };
  };
};

export function withAuthorization<P extends object>(
  WrappedComponent: ComponentType<P>,
  { requireAdmin = false }: Options = {}
) {
  return function AuthorizedComponent(props: P) {
    const router = useRouter();
    const { data: session, status } = useSession() as { 
      data: ExtendedSession | null; 
      status: 'loading' | 'authenticated' | 'unauthenticated' 
    };
    
    // Use individual action hooks
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
        // Update store with session data
        const sessionUser = {
          ...session.user,
          isAdmin: session.user.role?.name === 'admin'
        };
        
        // Only update if user data is different
        if (!user || user.email !== sessionUser.email || user.role?.name !== sessionUser.role?.name) {
          setUser(sessionUser);
        }
      } else if (status === 'unauthenticated') {
        // Clear store when session is cleared
        if (user) {
          clearUser();
        }
      }
    }, [status, session?.user, user?.email, user?.role?.name, setUser, clearUser, setLoading, hasHydrated]);

    // Redirect logic
    useEffect(() => {
      if (status === 'loading' || !hasHydrated || hasRedirected.current) return;

      const isAuthenticated = !!user;
      if (!isAuthenticated) {
        hasRedirected.current = true;
        message.warning(i18next.t('Not logged in'));
        router.replace(routes.auth.login);
        return;
      }

      const isAdmin = user.role?.name === 'admin' || user.isAdmin;
      if (requireAdmin && !isAdmin) {
        hasRedirected.current = true;
        message.warning(i18next.t('Not authorized'));
        router.replace(routes.library);
      }
    }, [status, user, requireAdmin, router, message, hasHydrated]);

    // Prevent render until we know the auth state
    if (status === 'loading' || !hasHydrated) return   <LoadingSpinner />;
    
    if (!user) return null;
    
    const isAdmin = user.role?.name === 'admin' || user.isAdmin;
    if (requireAdmin && !isAdmin) return null;

    return <WrappedComponent {...props} />;
  };
}
