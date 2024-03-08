'use client';

import { DarkThemeToggle, Navbar } from 'flowbite-react';
import i18next from 'i18next';
import useAuth from '@hooks/useAuth';
import { ADMIN_LINKS } from './links';
import Link from 'next/link';
import AppLogo from '@components/logo';
import { HiMenuAlt1, HiX } from 'react-icons/hi';

export function AdminNavbar({
  sidebarIsCollapsed,
  toggleSidebar,
}: {
  sidebarIsCollapsed: boolean;
  toggleSidebar: () => void;
}) {
  const { isAuthenticated, handleLogout } = useAuth();

  return (
    <Navbar className="nav-bar" fluid>
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
      <Navbar.Brand href="/" as={Link}>
        <AppLogo />
      </Navbar.Brand>

      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link as={Link} className="mt-[10px]" href="/">
          {i18next.t('home')}
        </Navbar.Link>

        {!isAuthenticated ? (
          <>
            <Navbar.Link as={Link} className="mt-[10px]" href="/auth/signup">
              {i18next.t('login_signup')}
            </Navbar.Link>
          </>
        ) : (
          <>
            <Navbar.Link as={Link} className="mt-[10px]" href={ADMIN_LINKS.home.link} active={true}>
              {i18next.t('admin')}
            </Navbar.Link>
            <Navbar.Link as={Link} className="mt-[10px]" onClick={handleLogout} href="#">
              {i18next.t('logout')}
            </Navbar.Link>
          </>
        )}
        <DarkThemeToggle />
      </Navbar.Collapse>
    </Navbar>
  );
}
