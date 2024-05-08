import { Inter } from 'next/font/google';
import './custom.css';
import './globals.css';
import { Session } from 'next-auth';
import { ReactNode } from 'react';
import { ThemeModeScript } from 'flowbite-react';
import AppProviders from 'providers/AppProviders';

const inter = Inter({ subsets: ['latin'] });

const RootLayout = ({
  children,
  pageProps,
}: {
  children: ReactNode;
  pageProps?: {
    session?: Session;
  };
}) => {
  return (
    <html lang="en">
      <head>
        <ThemeModeScript />
      </head>
      <body className={`${inter.className} custom-scrollbar dark:bg-gray-800 dark:text-white`}>
        <AppProviders session={pageProps?.session}>{children}</AppProviders>
      </body>
    </html>
  );
};

export default RootLayout;
