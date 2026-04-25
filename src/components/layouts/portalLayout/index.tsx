'use client';

import { ReactNode, FC } from 'react';
import AppLogo from '@components/logo';

const PortalLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <main className="">
      <nav className="nav-bar flex flex-wrap items-center justify-between rounded px-4 py-2.5">
        <a href="#">
          <AppLogo />
        </a>
        <ul className="flex flex-wrap items-center gap-4 text-sm font-medium">
          <li><a href="/navbars" className="text-blue-700 dark:text-blue-400">Home</a></li>
          <li><a href="/navbars">About</a></li>
          <li><a href="/navbars">Services</a></li>
          <li><a href="/navbars">Pricing</a></li>
          <li><a href="/navbars">Contact</a></li>
        </ul>
      </nav>
      {children}
    </main>
  );
};

export default PortalLayout;
