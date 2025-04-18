'use client';
import useAuth from '@hooks/useAuth';
import { Spinner } from 'flowbite-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { LoginSignupLinks } from './LoginSignupLinks';

export function LogOutButton() {
  const { data: session } = useSession();
  const { handleLogout, loading, isAuthenticated } = useAuth();

  // @ts-expect-error
  const isAdmin = session?.user?.role === 'Admin';
  const handleUserLogout = () => {
    handleLogout();
  };

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
