'use client';

import { SessionProvider } from 'next-auth/react';
import { Flowbite } from 'flowbite-react';
import { ReactNode } from 'react';
import { Session } from 'next-auth';
import { AppProgressBar } from 'next-nprogress-bar';
import { OpenpanelProvider } from '@openpanel/nextjs';
import { HighlightInit } from '@highlight-run/next/client';
import { NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID, NEXT_PUBLIC_OPENPANEL_CLIENT_ID } from 'utils/constants';

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
        <OpenpanelProvider
          clientId={NEXT_PUBLIC_OPENPANEL_CLIENT_ID}
          profileId={session?.user?.email || 'anonymous'}
          trackScreenViews
          trackAttributes
          trackOutgoingLinks
        />
        <HighlightInit
          projectId={NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID}
          serviceName="sparked-next"
          tracingOrigins
          excludedHostnames={['localhost', 'onrender.com']}
          networkRecording={{
            enabled: true,
            recordHeadersAndBody: true,
            urlBlocklist: [],
          }}
        />
        {children}
        <AppProgressBar color="#3584e4" height="4px" options={{ showSpinner: false }} />
      </SessionProvider>
    </Flowbite>
  );
}
