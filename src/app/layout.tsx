'use client';

import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import './custom.css';
import './globals.css';
import 'utils/intl';
import { Session } from 'next-auth';
import { ReactNode } from 'react';
import { Flowbite, ThemeModeScript } from 'flowbite-react';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

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
        <Flowbite>
          <SessionProvider session={pageProps?.session}>
            {children}
            <ProgressBar color="#3584e4" height="4px" options={{ showSpinner: false }} />
          </SessionProvider>
        </Flowbite>
      </body>
    </html>
  );
};

export default RootLayout;
