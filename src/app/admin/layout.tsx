'use client';

import AdminLayout from '@components/layouts/adminLayout';
import { withAuthorization } from '@hocs/withAuthorization';
import { ReactNode } from 'react';

const RootLayout = ({ children }: { children: ReactNode | ReactNode[] }) => {

  return <AdminLayout withBreadcrumb>{children}</AdminLayout>;
}



export default withAuthorization(RootLayout, { requireAdmin: true });