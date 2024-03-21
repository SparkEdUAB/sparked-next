import AppLogo from '@components/logo';
import { Flex } from 'antd';
import { DarkThemeToggle } from 'flowbite-react';
import Link from 'next/link';

const HeaderSection = () => {
  return (
    <header className="bg-sky-50  dark:bg-gray-900">
      <nav className="max-w-screen-lg px-6 mx-auto py-2.5 ">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-lg">
          <a href="" className="flex items-center">
            <AppLogo />
          </a>
          <div className="flex items-center lg:order-2">
            <Flex gap="small" wrap="wrap" align="center">
              <Link href="/auth/login" className="text-sky-600 dark:text-sky-400 font-medium mr-2">
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-sky-600 dark:hover:bg-sky-700 focus:outline-none dark:focus:ring-sky-800"
              >
                Sign Up
              </Link>
              <DarkThemeToggle color="" className="text-sky-600 dark:text-sky-400" />
            </Flex>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderSection;
