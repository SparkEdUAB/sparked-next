'use client';

import { SessionProvider } from 'next-auth/react';
import { Flowbite } from 'flowbite-react';
import { ReactNode } from 'react';
import { Session } from 'next-auth';
import { AppProgressBar } from 'next-nprogress-bar';

export default function AppProviders({
  children,
  session,
}: {
  children: ReactNode | ReactNode[];
  session: Session | null | undefined;
}) {
  return (
    <Flowbite>
      <SessionProvider session={session}>
        {children}
        <AppProgressBar color="#3584e4" height="4px" options={{ showSpinner: false }} />
      </SessionProvider>
    </Flowbite>
  );
}
