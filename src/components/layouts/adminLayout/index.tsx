'use client';

import { FC, useCallback, useState } from 'react';

import AdminSidebar from './sidebar';
import { T_AdminLayout } from './types';
import AdminHeader from './AdminHeader';
import { ADMIN_LINKS } from './links';
import { AdminNavbar } from './AdminNavbar';

const AdminLayout: FC<T_AdminLayout> = ({ children, withBreadcrumb = true }) => {
  const [sidebarIsCollapsed, setSidebarIsCollapsed] = useState(true);
  const toggleSidebar = useCallback(() => setSidebarIsCollapsed((value) => !value), [setSidebarIsCollapsed]);

  return (
    <main className="h-[calc(100vh_-_62px)]">
      <AdminNavbar sidebarIsCollapsed={sidebarIsCollapsed} toggleSidebar={toggleSidebar} />
      <div
        className={`md:grid h-[calc(100vh_-_62px)] ${
          sidebarIsCollapsed ? 'md:grid-cols-[80px_calc(100%_-_80px)]' : 'md:grid-cols-[256px_calc(100%_-_256px)]'
        } transition-all duration-300`}
      >
        <AdminSidebar sidebarIsCollapsed={sidebarIsCollapsed} toggleSidebar={toggleSidebar} />
        <div id="scrollableDiv" className="p-6 max-h-full overflow-y-scroll">
          {withBreadcrumb && <AdminHeader menuItems={ADMIN_LINKS} />}
          <div className="py-6">{children}</div>
        </div>
      </div>
    </main>
  );
};

export default AdminLayout;
