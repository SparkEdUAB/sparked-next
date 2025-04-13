"use client"
import AppLogo from '@components/logo';
import { DarkThemeToggle } from 'flowbite-react';
import { useSession } from 'next-auth/react';
import { LogOutButton } from './LogOutButton';
import { LoginSignupLinks } from './LoginSignupLinks';

const HeaderSection = () => {
  const { status } = useSession();

  return (
    <header className="bg-sky-50  dark:bg-gray-900">
      <nav className="max-w-screen-lg px-6 mx-auto py-2.5 ">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-lg">
          <a href="" className="flex items-center">
            <AppLogo />
          </a>
          <div className="flex items-center lg:order-2">
            <div className="flex flex-row gap-2 flex-wrap items-center">
              {status === "authenticated" ? <LogOutButton /> : <LoginSignupLinks />}
              <DarkThemeToggle color="" className="text-sky-600 dark:text-sky-400 theme-toggle" />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderSection;
