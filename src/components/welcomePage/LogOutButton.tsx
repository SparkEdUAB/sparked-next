'use client';
import useAuth from '@hooks/useAuth';
import { Spinner } from 'flowbite-react';
import { LoginSignupLinks } from './LoginSignupLinks';

export function LogOutButton() {
  let { handleLogout, loading, isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <button onClick={handleLogout} className="text-sky-600 dark:text-sky-400 font-medium mr-2">
      {loading ? <Spinner size="sm" className="mr-1" /> : undefined} Logout
    </button>
  ) : (
    <LoginSignupLinks />
  );
}
