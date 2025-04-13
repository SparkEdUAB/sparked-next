'use client';

import useNavigation from '@hooks/useNavigation';
import { Sidebar } from 'flowbite-react';
import Link from 'next/link';
import { useEffect } from 'react';

const AdminSidebar = ({
  sidebarIsCollapsed,
  toggleSidebar,
}: {
  sidebarIsCollapsed: boolean;
  toggleSidebar: () => void;
}) => {
  const { fetchAdminMenuItems, isActiveMenuItem } = useNavigation();

  const menuItems = fetchAdminMenuItems();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => event.code === 'Escape' && toggleSidebar();
    document.addEventListener('keyup', handler);
    return () => document.removeEventListener('keyup', handler);
  }, [toggleSidebar]);

  return (
    <>
      <div
        className={`fixed inset-0 transition-all duration-300 z-20 h-full w-64 flex-none md:static md:block md:h-auto md:overflow-y-visible ${sidebarIsCollapsed ? '-left-64' : 'left-0'
          }`}
      >
        <Sidebar aria-label="Sidebar with logo branding">
          <Sidebar.Items className="admin-menu">
            <Sidebar.ItemGroup>
              {menuItems
                .sort((a, b) => a.index - b.index)
                .map((i) => (
                  <Sidebar.Item as={Link} active={isActiveMenuItem(i)} key={i.key} onClick={toggleSidebar} href={i.link} icon={i.icon}>
                    <p>{i.label}</p>
                  </Sidebar.Item>
                ))}
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 z-10 transition-all duration-300 rounded-br-full cursor-pointer bg-gray-900/50 dark:bg-gray-900/60 md:hidden backdrop-blur-sm ${sidebarIsCollapsed ? 'w-0 h-0' : 'w-[200vmax] h-[200vmax]'
          }`}
      />
    </>
  );
};

export default AdminSidebar;
