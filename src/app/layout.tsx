"use client";

import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "./custom.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
  pageProps,
}: {
  children: React.ReactNode;
  pageProps?: any;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={pageProps?.session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
