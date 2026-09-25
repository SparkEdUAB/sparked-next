'use client';
import AppLogo from '@components/logo';
import { ThemeToggle } from '@/components/admin/layout/ThemeToggle';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { LogOutButton } from './LogOutButton';
import { LoginSignupLinks } from './LoginSignupLinks';

const HeaderSection = () => {
  const { status } = useSession();

  return (
    <header className="bg-[#eaf4f8] dark:bg-[#102735]">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-5 sm:px-8 md:grid md:grid-cols-[1fr_auto_1fr] md:flex-nowrap lg:px-10" aria-label="Main navigation">
        <Link href="/" className="flex shrink-0 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#287fa3]">
          <AppLogo />
        </Link>
        <div className="order-3 flex w-full items-center justify-center gap-5 border-t border-[#c7dce5] pt-3 text-sm md:order-none md:w-auto md:gap-8 md:border-0 md:pt-0 dark:border-white/15">
          <Link href="/library" className="shrink-0 font-medium text-[#35677e] hover:text-[#174f6b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#287fa3] dark:text-sky-100">
            Library
          </Link>
          <a href="#why-sparked" className="shrink-0 font-medium text-[#35677e] hover:text-[#174f6b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#287fa3] dark:text-sky-100">
            Why SparkEd
          </a>
          <a href="#for-schools" className="shrink-0 font-medium text-[#35677e] hover:text-[#174f6b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#287fa3] dark:text-sky-100">
            For schools
          </a>
        </div>
        <div className="ml-auto flex items-center gap-3 sm:gap-5 md:ml-0 md:justify-self-end">
          {status === 'authenticated' ? <LogOutButton /> : <LoginSignupLinks />}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default HeaderSection;
