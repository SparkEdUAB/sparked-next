'use client';

import { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';

import AdminSidebar from './sidebar';
import { TadminLayout } from './types';
import AdminHeader from './AdminHeader';
import { ADMIN_LINKS } from './links';
import { AdminNavbar } from './AdminNavbar';

const AdminLayout: FC<TadminLayout> = observer(({ children, withBreadcrumb = true }) => {
  const [sidebarIsCollapsed, setSidebarIsCollapsed] = useState(true);

  const toggleSidebar = () => setSidebarIsCollapsed((value) => !value);

  return (
    <main className="admin-content-page">
      <AdminNavbar sidebarIsCollapsed={sidebarIsCollapsed} toggleSidebar={toggleSidebar} />

      <div className="md:grid md:grid-cols-[256px_auto]">
        <AdminSidebar sidebarIsCollapsed={sidebarIsCollapsed} toggleSidebar={toggleSidebar} />

        <div className="p-6">
          {withBreadcrumb && <AdminHeader menuItems={ADMIN_LINKS} />}
          {children}
        </div>
      </div>
    </main>
  );
});

export default AdminLayout;
