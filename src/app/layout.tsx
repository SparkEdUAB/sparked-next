import { Inter } from 'next/font/google';
import './custom.css';
import './globals.css';
import { Session, getServerSession } from 'next-auth';
import { ReactNode } from 'react';
import { ThemeModeScript } from 'flowbite-react';
import AppProviders from 'providers/AppProviders';
import { authOptions } from './api/auth/authOptions';

const inter = Inter({ subsets: ['latin'] });

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <ThemeModeScript />
      </head>
      <body className={`${inter.className} custom-scrollbar dark:bg-gray-800 dark:text-white`}>
        <AppProviders session={session}>{children}</AppProviders>
      </body>
    </html>
  );
};

export default RootLayout;
