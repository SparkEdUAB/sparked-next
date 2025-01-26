'use client';

import { Flowbite } from 'flowbite-react';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { AppProgressBar } from 'next-nprogress-bar';
import { ReactNode } from 'react';
import 'utils/intl';
import { ToastMessageProvider } from './ToastMessageContext';

interface AppProvidersProps {
  children: ReactNode | ReactNode[];
  session: Session | null | undefined;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children, session }) => {
  return (
    <Flowbite>
      <SessionProvider session={session}>
        <ToastMessageProvider>{children}</ToastMessageProvider>
        <AppProgressBar color="#3584e4" height="4px" options={{ showSpinner: false }} />
      </SessionProvider>
    </Flowbite>
  );
};

export default AppProviders;
