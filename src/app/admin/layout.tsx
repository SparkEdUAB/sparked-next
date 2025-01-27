'use client';

import AdminLayout from '@components/layouts/adminLayout';
import { ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next-nprogress-bar';

export default function RootLayout({ children }: { children: ReactNode | ReactNode[] }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== 'authenticated') {
      router.replace('/library');
    }
  }, [status, router]);

  return <AdminLayout withBreadcrumb>{children}</AdminLayout>;
}
