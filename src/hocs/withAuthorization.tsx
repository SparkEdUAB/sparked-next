// lib/withAuthorization.tsx
'use client';

import { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMeStore } from '@stores/useMeStore';
import { routes } from 'routes';
import { useToastMessage } from 'providers/ToastMessageContext';
import i18next from 'i18next';

interface Options {
  requireAdmin?: boolean;
}

export function withAuthorization<P extends object>(
  WrappedComponent: ComponentType<P>,
  { requireAdmin = false }: Options = {}
) {
  return function AuthorizedComponent(props: P) {
    const router = useRouter();
    const user = useMeStore((state) => state.user);
    // const hasHydrated = useMeStore.persist.hasHydrated();
    const hasHydrated = useMeStore((state) => state._hasHydrated ?? true);

    const message = useToastMessage();

    // Redirect logic
    useEffect(() => {
      if (!hasHydrated) return;

      if (!user) {
        console.log("hhe rre", router, routes)
        router.replace(routes.auth.login);
        message.warning(i18next.t('Not logged in'));
        return;
      }
       console.log("hhe after", user)
      if (requireAdmin && !user.isAdmin) {
        router.replace(routes.library);
        message.warning(i18next.t('Not authorized'));
      }
    }, [hasHydrated, user, requireAdmin, router, message]);

    // Prevent render until we know
    if (!hasHydrated) return <div>Loading...</div>;
    if (!user) return null;
    if (requireAdmin && !user.isAdmin) return null;

    return <WrappedComponent {...props} />;
  };
}
