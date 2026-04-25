'use client';

import { AdminShell } from '@components/admin/layout/AdminShell';
import { withAuthorization } from '@hocs/withAuthorization';
import { ReactNode } from 'react';

const RootLayout = ({ children }: { children: ReactNode | ReactNode[] }) => {
  return <AdminShell>{children}</AdminShell>;
};

export default withAuthorization(RootLayout, { requireAdmin: true });
