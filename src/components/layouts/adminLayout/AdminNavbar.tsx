'use client';

import i18next from 'i18next';
import useAuth from '@hooks/useAuth';
import { ADMIN_LINKS } from './links';
import Link from 'next/link';
import AppLogo from '@components/logo';
import { HiMenuAlt1, HiX } from 'react-icons/hi';
import { ThemeToggle } from '@/components/admin/layout/ThemeToggle';

export function AdminNavbar({
  sidebarIsCollapsed,
  toggleSidebar,
}: {
  sidebarIsCollapsed: boolean;
  toggleSidebar: () => void;
}) {
  const { isAuthenticated, handleLogout } = useAuth();

  return (
    <nav className="nav-bar flex flex-wrap items-center justify-between px-4 py-2.5">
      <div className="flex items-center gap-2">
        {sidebarIsCollapsed ? (
          <button type="button" className="-ml-3 mr-1 p-2 md:ml-0 md:mr-0 md:hidden" onClick={toggleSidebar}>
            <HiMenuAlt1 aria-label="Open sidebar" className="h-6 w-6 cursor-pointer text-gray-600 dark:text-gray-300" />
          </button>
        ) : (
          <button
            type="button"
            className="-ml-3 mr-1 rounded p-2 dark:bg-gray-700 md:ml-0 md:mr-0 md:hidden"
            onClick={toggleSidebar}
          >
            <HiX aria-label="Close sidebar" className="h-6 w-6 cursor-pointer text-gray-600 dark:text-gray-300" />
          </button>
        )}
        <Link href="/">
          <AppLogo />
        </Link>
      </div>

      <ul className="flex flex-wrap items-center gap-4 text-sm font-medium mt-2.5">
        <li>
          <Link className="mt-[10px]" href="/">
            {i18next.t('home')}
          </Link>
        </li>

        {!isAuthenticated ? (
          <li>
            <Link className="mt-[10px]" href="/auth/signup">
              {i18next.t('login_signup')}
            </Link>
          </li>
        ) : (
          <>
            <li>
              <Link className="mt-[10px]" href={ADMIN_LINKS.home.link}>
                {i18next.t('admin')}
              </Link>
            </li>
            <li>
              <Link className="mt-[10px]" onClick={handleLogout} href="#">
                {i18next.t('logout')}
              </Link>
            </li>
          </>
        )}
        <li>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
}
