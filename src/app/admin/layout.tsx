'use client';

import AdminLayout from '@components/layouts/adminLayout';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode | ReactNode[] }) {
  return <AdminLayout withBreadcrumb>{children}</AdminLayout>;
}
