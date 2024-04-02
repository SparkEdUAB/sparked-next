'use client';

import { Inter } from 'next/font/google';
import './custom.css';
import './globals.css';
import 'utils/intl';
import { Session } from 'next-auth';
import { ReactNode } from 'react';
import { ThemeModeScript } from 'flowbite-react';
import AppProviders from 'providers/AppProviders';

const inter = Inter({ subsets: ['latin'] });

interface I_RootLayoutProps {
  children: ReactNode;
  pageProps?: {
    session?: Session;
  };
}

const RootLayout = ({ children, pageProps }: I_RootLayoutProps) => {
  return (
    <html lang="en">
      <head>
        <ThemeModeScript />
      </head>
      <body className={`${inter.className} dark:bg-gray-800 dark:text-white`}>
        <AppProviders session={pageProps?.session}>{children}</AppProviders>
      </body>
    </html>
  );
};

export default RootLayout;
