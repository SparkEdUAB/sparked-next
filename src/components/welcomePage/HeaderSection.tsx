import AppLogo from '@components/logo';
import { Flex } from 'antd';
import { DarkThemeToggle } from 'flowbite-react';
import Link from 'next/link';

const HeaderSection = () => {
  return (
    <header className="bg-blue-50  dark:bg-gray-800">
      <nav className="max-w-screen-xl px-4 mx-auto lg:px-6 py-2.5 ">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a href="" className="flex items-center">
            <AppLogo />
          </a>
          <div className="flex items-center lg:order-2">
            <Flex gap="small" wrap="wrap" align="center">
              <Link href="/auth/login" className="text-blue-600 font-medium mr-2">
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Sign Up
              </Link>
              <DarkThemeToggle />
            </Flex>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderSection;
