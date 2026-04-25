'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { AppProgressBar } from 'next-nprogress-bar';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import 'utils/intl';
import { ToastMessageProvider } from './ToastMessageContext';

interface AppProvidersProps {
  children: ReactNode | ReactNode[];
  session: Session | null | undefined;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children, session }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <SessionProvider session={session}>
        <ToastMessageProvider>{children}</ToastMessageProvider>
        <AppProgressBar color="#14b8a6" height="4px" options={{ showSpinner: false }} />
      </SessionProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
