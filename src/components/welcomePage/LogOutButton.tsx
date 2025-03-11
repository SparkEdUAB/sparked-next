'use client';
import { useFetch } from '@hooks/use-swr';
import useAuth from '@hooks/useAuth';
import { API_LINKS } from 'app/links';
import { Spinner } from 'flowbite-react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { useMemo } from 'react';
import { LoginSignupLinks } from './LoginSignupLinks';
import { revalidateEvents } from 'swr/_internal';

export function LogOutButton() {
  const { data: session, status } = useSession()
  const { handleLogout, loading, isAuthenticated } = useAuth();

  // Only fetch if user is authenticated and has an email
  const userEmail = session?.user?.email as string;
  const shouldFetch = isAuthenticated && userEmail;
  const { data, mutate } = useFetch(
    shouldFetch ? `${API_LINKS.FIND_USER_BY_EMAIL}?email=${encodeURIComponent(userEmail)}` : null,

  );


  const isAdmin = useMemo(() => data?.users?.[0]?.role === "Admin", [data])
  const handleUserLogout = () => {
    handleLogout();
    mutate();
  }

  return isAuthenticated ? (
    <div className="flex items-center">
      {isAdmin && (
        <Link href="/admin" className="text-sky-600 dark:text-sky-400 font-medium mr-4">
          Dashboard
        </Link>
      )}
      <button onClick={handleUserLogout} className="text-sky-600 dark:text-sky-400 font-medium mr-2">
        {loading ? <Spinner size="sm" className="mr-1" /> : undefined} Logout
      </button>
    </div>
  ) : (
    <LoginSignupLinks />
  );
}
