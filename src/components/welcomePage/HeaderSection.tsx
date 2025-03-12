import { authOptions } from '@app/api/auth/authOptions';
import AppLogo from '@components/logo';
import { DarkThemeToggle } from 'flowbite-react';
import { getServerSession } from 'next-auth';
import { LogOutButton } from './LogOutButton';
import { LoginSignupLinks } from './LoginSignupLinks';

const HeaderSection = async () => {
  const session = await getServerSession(authOptions);

  return (
    <header className="bg-sky-50  dark:bg-gray-900">
      <nav className="max-w-screen-lg px-6 mx-auto py-2.5 ">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-lg">
          <a href="" className="flex items-center">
            <AppLogo />
          </a>
          <div className="flex items-center lg:order-2">
            <div className="flex flex-row gap-2 flex-wrap items-center">
              {!session ? <LoginSignupLinks /> : <LogOutButton />}
              <DarkThemeToggle color="" className="text-sky-600 dark:text-sky-400 theme-toggle" />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderSection;
