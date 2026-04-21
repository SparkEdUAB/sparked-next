'use client';

import AppLogo from '@components/logo';
import useAuth from '@hooks/useAuth';
import { useMeStore } from '@stores/useMeStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
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

  return (
    <nav className="sticky top-0 z-[60] flex flex-nowrap items-center justify-between border-b border-border bg-white px-4 py-2 dark:bg-gray-800">
      <div className={`pl-2 flex flex-row sm:gap-2 md:gap-4 flex-nowrap ${searching ? 'hidden md:flex' : ''}`}>
        <button type="button" className="text-gray-500 -ml-3 mr-1 p-2 md:ml-0 md:mr-0 " onClick={toggleSidebar}>
          {sidebarIsCollapsed ? (
            <MdMenu aria-label="Open sidebar" className="h-6 w-6 cursor-pointer text-gray-500 dark:text-gray-400" />
          ) : (
            <HiX aria-label="Close sidebar" className="h-6 w-6 cursor-pointer text-gray-500 dark:text-gray-400" />
          )}
        </button>
        <Link href="/library" className="sm:w-1/3 md:w-fit flex items-center">
          <AppLogo />
        </Link>
      </div>
      <div className={`flex flex-row gap-4 items-center ${searching ? 'w-full md:w-fit' : ''}`}>
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
          <div className={`relative ${searching ? '' : 'hidden md:block'}`}>
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="w-full pl-9"
              type="search"
              placeholder="Search"
              name="q"
            />
          </div>
        </form>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" aria-label="User menu">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback className="text-xs bg-gray-200 dark:bg-gray-700">
                  {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {userEmail && (
              <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                {userEmail}
              </DropdownMenuItem>
            )}
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link href={routes.admin}>Dashboard</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={logoutLoading}
              onClick={handleLogout}
              aria-disabled={logoutLoading}
            >
              <span className={logoutLoading ? 'opacity-50 pointer-events-none' : ''}>
                Logout
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={() => setSearching((value) => !value)}
          className={`rounded-lg md:hidden p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700`}
        >
          {searching ? <HiX size={22} /> : <HiSearch size={22} />}
        </button>
      </div>
    </nav>
  );
}
