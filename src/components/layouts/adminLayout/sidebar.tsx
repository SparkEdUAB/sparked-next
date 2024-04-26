'use client';

import useConfig from '@hooks/use-config';
import useNavigation from '@hooks/useNavigation';
import { Badge, Sidebar } from 'flowbite-react';
import i18next from 'i18next';
import Link from 'next/link';

const AdminSidebar = ({
  sidebarIsCollapsed,
  toggleSidebar,
}: {
  sidebarIsCollapsed: boolean;
  toggleSidebar: () => void;
}) => {
  const { fetchAdminMenuItems, isActiveMenuItem } = useNavigation();

  const menuItems = fetchAdminMenuItems();

  return (
    <>
      <div
        className={`fixed inset-0 z-50 h-full w-64 flex-none md:static md:block md:h-auto md:overflow-y-visible ${
          sidebarIsCollapsed ? 'hidden' : ''
        }`}
      >
        <Sidebar aria-label="Sidebar with logo branding">
          <Sidebar.Items className="admin-menu">
            <Sidebar.ItemGroup>
              {menuItems
                .sort((a, b) => a.index - b.index)
                .map((i) => (
                  <Sidebar.Item as={Link} active={isActiveMenuItem(i)} key={i.key} href={i.link} icon={i.icon}>
                    <p>{i.label}</p>
                  </Sidebar.Item>
                ))}
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
      {!sidebarIsCollapsed && (
        <div
          onClick={toggleSidebar}
          onKeyUp={(key) => key.code === 'Escape' && toggleSidebar()}
          className="fixed inset-0 z-40 bg-gray-900/50 dark:bg-gray-900/60 lg:hidden"
        />
      )}
    </>
  );
};

export default AdminSidebar;
