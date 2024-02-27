"use client";

import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "./custom.css";
import "./globals.css";
import "utils/intl";
import {ConfirmDialog} from "@components/modals";
import { Session } from "next-auth";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps {
  children: ReactNode;
  pageProps?: {
    session?: Session;
  };
}

const RootLayout = ({ children, pageProps }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={pageProps?.session}>
          <ConfirmDialog />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;