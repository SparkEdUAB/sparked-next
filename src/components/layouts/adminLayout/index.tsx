'use client';

import { Navbar } from 'flowbite-react';
import i18next from 'i18next';
import { FC } from 'react';

import useAuth from '@hooks/useAuth';
import { observer } from 'mobx-react-lite';
import AdminSidebar from './sidebar';
import { TadminLayout } from './types';
import AdminHeader from './AdminHeader';
import useNavigation from '@hooks/useNavigation';
import { ADMIN_LINKS } from './links';

const AdminLayout: FC<TadminLayout> = observer(({ children, withBreadcrumb = true }) => {
  const { isAuthenticated, handleLogout } = useAuth();
  const { activeMenuItem } = useNavigation();

  return (
    <main className="h-screen">
      <div className="grid grid-cols-5 grid-rows-5 gap-4 h-full">
        <div className="basis-1/12">
          <AdminSidebar />
        </div>

        <div className="col-span-4">
          {withBreadcrumb && <AdminHeader menuItems={ADMIN_LINKS} targetLink={activeMenuItem?.link as string} />}
          {children}
        </div>
      </div>
    </main>
  );
});

export default AdminLayout;
