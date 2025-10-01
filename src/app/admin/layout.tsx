'use client';

import AdminLayout from '@components/layouts/adminLayout';
import { ReactNode } from 'react';
import { useRouter } from 'next-nprogress-bar';
import useAuth from '@hooks/useAuth';
import { routes } from 'routes';
import { useToastMessage } from 'providers/ToastMessageContext';
import i18next from 'i18next';
import { useMeStore } from 'stores/useMeStore';

export default function RootLayout({ children }: { children: ReactNode | ReactNode[] }) {
  const router = useRouter();
  const { loading } = useAuth();
  const message = useToastMessage();
  const user = useMeStore((state) => state.user);
  const hasHydrated = useMeStore.persist.hasHydrated();

  const userIsAdmin = user?.role === 'admin';

  // Guard logic
  if (!hasHydrated || loading) return null;
  

  if (!userIsAdmin) {
    router.replace(routes.library);
    message.warning(i18next.t('Access denied'));
    return null;
  }

  return <AdminLayout withBreadcrumb>{children}</AdminLayout>;
}
