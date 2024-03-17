'use client';

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

          <Sidebar.CTA className="admin-menu">
            <div className="mb-3 flex items-center">
              <Badge color="warning">
                <p>{i18next.t('beta')}</p>
              </Badge>
              <button
                aria-label="Close"
                className="-m-1.5 ml-auto inline-flex h-6 w-6 rounded-lg bg-gray-100 p-1 text-cyan-900 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                type="button"
              ></button>
            </div>
            <div className="mb-3 text-sm text-gray-500 dark:text-indigo-400">
              <p>{i18next.t('app_beta_note')}</p>
            </div>
            <a
              className="text-sm text-cyan-900 underline hover:text-cyan-800 dark:text-gray-400 dark:hover:text-gray-300"
              href="#"
            >
              <p className="mb-3 text-sm text-gray-500 dark:text-indigo-400">Got it !</p>
            </a>
          </Sidebar.CTA>
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
