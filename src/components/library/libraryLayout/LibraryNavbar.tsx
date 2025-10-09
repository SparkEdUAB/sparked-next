'use client';


import AppLogo from '@components/logo';
import useAuth from '@hooks/useAuth';
import { useMeStore } from '@stores/useMeStore';
import { Avatar, DarkThemeToggle, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { useRouter } from 'next-nprogress-bar';
import Link from 'next/link';
import { useState } from 'react';
import { HiSearch, HiX } from 'react-icons/hi';
import { MdMenu } from 'react-icons/md';
import { routes } from 'routes';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';

export function LibraryNavbar({
  toggleSidebar,
  sidebarIsCollapsed,
}: {
  toggleSidebar: () => void;
  sidebarIsCollapsed: boolean;
}) {
  let [searching, setSearching] = useState(false);
  let router = useRouter();
  const { handleLogout, logoutLoading } = useAuth();
  const isAdmin = useMeStore((state) => state.user?.isAdmin);
  const userEmail = useMeStore((state) => state.user?.email);
  const user = useMeStore((state) => state.user);
console.log(user)

  return (
    <Navbar fluid rounded className="sticky top-0 z-[60]  flex-nowrap">
      <div className={`pl-2 flex flex-row sm:gap-2 md:gap-4 flex-nowrap ${searching ? 'hidden md:flex' : ''}`}>
        <button type="button" className="text-gray-500 -ml-3 mr-1 p-2 md:ml-0 md:mr-0 " onClick={toggleSidebar}>
          {sidebarIsCollapsed ? (
            <MdMenu aria-label="Open sidebar" className="h-6 w-6 cursor-pointer text-gray-500 dark:text-gray-400" />
          ) : (
            <HiX aria-label="Close sidebar" className="h-6 w-6 cursor-pointer text-gray-500 dark:text-gray-400" />
          )}
        </button>
        <Navbar.Brand className="sm: w-1/3 md:w-fit " as={Link} href="/library">
          <AppLogo />
        </Navbar.Brand>
      </div>
      <div className={`flex flex-row gap-4 ${searching ? 'w-full md:w-fit' : ''}`}>
        <form
          className="w-full md:w-64 md:focus-within:w-96 transition-all duration-300"
          action="/library/search"
          method="get"
          onSubmit={(e) => {
            e.preventDefault();
            let { q } = extractValuesFromFormEvent<{ q: string }>(e, ['q']);
            router.push(`/library/search?${new URLSearchParams({ q }).toString()}`);
          }}
        >
          <TextInput
            className={`w-full ${searching ? '' : 'hidden md:block'}`}
            type="search"
            placeholder="Search"
            name="q"
            icon={HiSearch}
          />
        </form>

        <Dropdown
          label="User"
          renderTrigger={() => (
            <Avatar
              id="dropdownHoverButton"
              data-dropdown-toggle="dropdownHover"
              data-dropdown-trigger="hover"
              // src="/avatar.png"
              alt="User Avatar"
              size="xs"
              rounded
            />
          )}
        >
          {userEmail && <Dropdown.Item>{userEmail}</Dropdown.Item>}
          {isAdmin && (
            <Dropdown.Item>
              <Link href={routes.admin} >
                Dashboard
              </Link>
            </Dropdown.Item>
          )}
          <Dropdown.Divider />
          <Dropdown.Item disabled={logoutLoading} className="hover:none"  onClick={handleLogout} aria-disabled={logoutLoading}>
            <span  className={logoutLoading ? 'opacity-50 pointer-events-none' : ''}>
              Logout
            </span>
          </Dropdown.Item>
        </Dropdown>

        <button
          onClick={() => setSearching((value) => !value)}
          className="rounded-lg md:hidden p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          {searching ? <HiX size={22} /> : <HiSearch size={22} />}
        </button>
        <DarkThemeToggle className={`${searching ? 'hidden md:flex' : ''}`} />
      </div>
    </Navbar>
  );
}
