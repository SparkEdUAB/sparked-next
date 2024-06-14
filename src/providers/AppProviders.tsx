'use client';

import 'utils/intl';
import { SessionProvider } from 'next-auth/react';
import { CustomFlowbiteTheme, Flowbite } from 'flowbite-react';
import { ReactNode } from 'react';
import { Session } from 'next-auth';
import { AppProgressBar } from 'next-nprogress-bar';
import { OpenpanelProvider } from '@openpanel/nextjs';
import { HighlightInit } from '@highlight-run/next/client';
import { NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID, NEXT_PUBLIC_OPENPANEL_CLIENT_ID } from 'utils/constants';
import { ToastMessageProvider } from './ToastMessageContext';

const customTheme: CustomFlowbiteTheme = {
  accordion: {
    root: {
      base: 'divide-y-2 border-2 divide-gray-200 border-gray-200 dark:divide-gray-600 dark:border-gray-600',
    },
    content: {
      base: 'p-5 first:rounded-t-lg last:rounded-b-lg dark:bg-gray-700',
    },
    title: {
      base: 'flex w-full items-center justify-between p-5 text-left font-medium text-gray-500 first:rounded-t-lg last:rounded-b-lg dark:text-gray-400',
      flush: {
        off: 'hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:hover:bg-gray-600 dark:focus:ring-gray-600',
        on: 'bg-transparent dark:bg-transparent',
      },
      open: {
        off: '',
        on: 'bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-white',
      },
    },
  },
};

export default function AppProviders({
  children,
  session,
}: {
  children: ReactNode | ReactNode[];
  session: Session | null | undefined;
}) {
  return (
    <Flowbite theme={{ theme: customTheme }}>
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
        <ToastMessageProvider>{children}</ToastMessageProvider>
        <AppProgressBar color="#3584e4" height="4px" options={{ showSpinner: false }} />
      </SessionProvider>
    </Flowbite>
  );
}
